#!/bin/bash

FILES=*.png
for f in $FILES
do
	sips -Z 256  $f --out $f.size512
	pngcrush -brute $f.size512 $f.256.png		
#   	cwebp -lossless -z 9 -m 6 -mt -hint picture -metadata none $f.size512.new -o "${f:4:${#f}-8}".512.webp 	
done

rm *size512
#rm org/*.new


