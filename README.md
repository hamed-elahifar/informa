# informa

informa is a simple ping base monitoring system written in node.js

## to start program

  - start mongodb with following parameters
  -- mongod --port 21021 --replSet r1 --dbpath c:\temp\db1
  - be sure redis is runing!
  - informa using system call for ping, windows ping service is not very efficient, so **strongly recommended** to run informa on a linux machine.