#!/bin/bash

# source directory with the original image files, relative to the script folder
DIR_INPUT=
# output directory relative to the script folder
DIR_OUT=wp

# maximum size in px for the image height and width
MAX_SIZE=198
FILES=*.png
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

for f in $SCRIPT_DIR/$DIR_INPUT/$FILES
do
	if [[ "$OSTYPE" == "darwin"* ]]; then
		sips -Z "${MAX_SIZE}"  $f --out $f.size"${MAX_SIZE}"
	else
	  size="${MAX_SIZE}x${MAX_SIZE}"
		magick $f -resize "${size}"\> $f.size"${MAX_SIZE}"
	fi

	pngcrush -brute $f.size"${MAX_SIZE}" $f


done

rm $SCRIPT_DIR/$DIR_INPUT/*size"${MAX_SIZE}"