#!/bin/bash

# source directory with the original image files, relative to the script folder
DIR_INPUT=
# output directory relative to the script folder
DIR_OUT=wp

# maximum size in px for the image height and width
MAX_SIZE=1024
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

	pngcrush -brute $f.size"${MAX_SIZE}" $f.size"${MAX_SIZE}".new

	filename_with_ext="${f##*/}"
	filename="${filename_with_ext%.*}"
	cwebp -near_lossless 50 -z 9 -mt -af -hint picture -metadata none $f.size"${MAX_SIZE}".new -o $SCRIPT_DIR/$DIR_OUT/"${filename}".webp
done

rm $SCRIPT_DIR/$DIR_INPUT/*size"${MAX_SIZE}"
rm $SCRIPT_DIR/$DIR_INPUT/*.new