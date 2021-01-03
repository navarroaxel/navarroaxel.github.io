# Build a network speed monitor in bash with AWK

Sometimes we need to measure the network speed of a server but some services like `speedtest` are not useful because we want to check our bandwidth with another cloud service and not the internet itself.

## AWK to the rescue

We can write a simple script in AWK to parse the `/proc/net/dev` pseudo-file which contains network device status information. AWK is a [programming language](https://dev.to/rrampage/awk---a-useful-little-language-2fhf) for manipulating columns of data that we can't solve with a simple `sed` command and a regex.

But before talk about the AWK script, we should define the sentences in bash that we need in this script. Or, you can jump to the end to find the complete script 😁.

## The bash part

We need to create a `.sh` file with an infinite loop to print the network speed every 2 seconds.

```bash
INTERFACE=eth0
echo "$INTERFACE  down (KiB/s)   up (KiB/s)"
while :
do
  # The AWK command here!
  sleep 2;
done
```

First, we save the name of network interface to inspect in a `INTERFACE` variable, in this example is `eth0`.

Second, we print a nice header to remember us which column is the download speed (and the upload one) and the speeds are measured in kilobytes per second (KiB/s, the `i` is because [1 Kibibyte is 1024 bytes](https://en.wikipedia.org/wiki/Byte#Units_based_on_powers_of_2)).

Then, we start the infinite loop with a sleep of 2 seconds between every iteration. Don't worry, this script will be stopped using `Ctrl+C`.

### Comparing the dev pseudo-file in time

We want to measure the network speed in KiB per second, so we should read the `/proc/net/dev` file and compare with a new read from the dev file after 1 second. For this we can use a little bash trick called [process substitution](https://tldp.org/LDP/abs/html/process-sub.html).

```bash
awk '...' \
  <(grep $INTERFACE /proc/net/dev) \
  <(sleep 1; grep $INTERFACE /proc/net/dev)
```

We use `grep` to read the line of our interface, and after wait for 1 second we must read the line of our interface again.

![Mr. Bean magic](https://dev-to-uploads.s3.amazonaws.com/i/mmadhlrajvdl2ed1m64l.jpg)

## The AWK script

If we check the output of `/proc/net/dev`

```bash
cat /proc/net/dev
```

We'll see that the 1st column is the interface name, the 2nd column is the received bytes (`rx`) and the 10th column is the transmitted bytes (`tx`).

We should save the first read in the `rx` and `tx` variables, and then `print` the difference of the 2nd read with the first one. But, we could divide the result by 1024 because KiB/s is a better human readable format than B/s.

```awk
{
  if (rx) {
    print "  "($2-rx)/1024"    "($10-tx)/1024
  } else {
    rx=$2; tx=$10;
  }
}
```

We can see this output from this:

```bash
$ ./net-monitor.sh
eth0  down (KiB/s)   up (KiB/s)
  0.123047    0.0683594
  5.38086    6.18457
  1132.12    70.1748
```

If we want to round the decimal part we can use the `printf` function for that.

```awk
{
  if (rx) {
    printf("  %.0f    %.0f\n", ($2-rx)/1024, ($10-tx)/1024)
  } else {
    rx=$2; tx=$10;
  }
}
```

## The bash script

This is our final bash script

```bash
echo "$INTERFACE  down (KiB/s)   up (KiB/s)"
while :
do
  awk '{
  if (rx) {
    printf ("  %.0f    %.0f\n", ($2-rx)/1024, ($10-tx)/1024)
  } else {
    rx=$2; tx=$10;
  }
}' \
    <(grep $INTERFACE /proc/net/dev) \
    <(sleep 1; grep $INTERFACE /proc/net/dev)
  sleep 2;
done
```

And it's ready! Just open a terminal and run the script to monitor the network speed while you run your network process.
