
You are hitting the error because you are running waydroid session start directly. The project (and working headless Waydroid) needs a compositor.

Correct sequence (recommended for testing with scrcpy):

# 1. Clean stop
waydroid session stop
sudo waydroid container stop

# 2. Fix permissions (common cause of "Permission denied" on the log)
sudo chown -R $USER:$USER /var/lib/waydroid

# 3. Start the container (as root)
sudo waydroid container start

# 4. Start a headless weston compositor (as your normal user)
weston --backend=headless-backend.so --socket=wayland-0 &

# 5. Start the Waydroid session with the correct environment
WAYLAND_DISPLAY=wayland-0 waydroid session start

Wait a few seconds, then:

# 6. Enable adb inside the container
sudo waydroid shell
setprop service.adb.tcp.port 5555
stop adbd
start adbd
exit

# 7. From the host
adb kill-server
adb start-server
adb connect 192.168.240.112:5555
adb devices          # should now show "device"

Then scrcpy:

scrcpy -s 192.168.240.112:5555

(or scrcpy --tcpip=192.168.240.112:5555)

4. If you still get "No route to host" or "Could not find any ADB device"

The bridge (waydroid0) is not ready or not reachable.

Try this full reset sequence:

waydroid session stop
sudo waydroid container stop

sudo waydroid container restart     # or: sudo waydroid container stop && sudo waydroid container start

waydroid session start              # with the weston + WAYLAND_DISPLAY as above

Inside the container again:

sudo waydroid shell
setprop service.adb.tcp.port 5555
stop adbd
start adbd
exit

Then on host:

adb kill-server
adb connect 192.168.240.112:5555
adb devices
__

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo chown -R $USER:$USER /var/lib/waydroid

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ ls -la /var/lib/waydroid
total 156
drwxrwxr-x 10 kai  kai   4096 Jun 18 22:24 .
drwxr-xr-x 59 root root  4096 Jun  7 20:30 ..
drwxrwxr-x  2 kai  kai   4096 Jun 13 04:38 cache_http
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 host-permissions
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 images
drwxrwxr-x  3 kai  kai   4096 Jun  7 21:05 lxc
drwxrwxr-x  3 kai  kai   4096 Jun  7 21:05 overlay
drwxrwxr-x  4 kai  kai   4096 Jun 13 04:38 overlay_rw
drwxrwxr-x  4 kai  kai   4096 Jun 13 05:18 overlay_work
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 rootfs
-rw-rw-r--  1 kai  kai    448 Jun 13 04:38 waydroid_base.prop
-rw-rw-r--  1 kai  kai    505 Jun 18 22:24 waydroid.cfg
-rw-r--r--  1 kai  kai  98737 Jun 19 20:10 waydroid.log
-rw-rw-r--  1 kai  kai    749 Jun 18 22:24 waydroid.prop

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo waydroid container start
[20:13:36] Container service is already running

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ weston --backend=headless-backend.so --socket=wayland-0 &
[1] 103635

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ Date: 2026-06-19 MDT
[20:14:14.702] weston 15.0.1
               https://wayland.freedesktop.org
               Bug reports to: https://gitlab.freedesktop.org/wayland/weston/issues/
               Build: 15.0.1
[20:14:14.703] Command line: weston --backend=headless-backend.so --socket=wayland-0


_________

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo waydroid shell
[sudo] password for kai: 
:/ # setprop service.adb.tcp.port 5555
:/ # stop adbd
:/ # start adbd
:/ # exit

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb kill-server 
cannot connect to daemon at tcp:5037: Connection refused

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb start-server

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb connect 192.168.240.112:5555
failed to connect to '192.168.240.112:5555': No route to host
____

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ WAYLAND_DISPLAY=wayland-0 waydroid session start
[20:16:57] Android with user 0 is ready
[20:17:26] Android with user 0 is ready
[20:17:56] Android with user 0 is ready

----
