#!/bin/bash

# Convert all .heic files in the current folder
# from kebab-case → UPPER_SNAKE_CASE (keeps .heic lowercase)

for file in *.heic; do
    # Skip if no .heic files found
    [[ -e "$file" ]] || continue

    # Get the filename without extension
    name="${file%.heic}"

    # Convert to uppercase and replace - with _
    new_name=$(echo "$name" | tr '[:lower:]-' '[:upper:]_')

    # Keep the extension lowercase
    new_file="${new_name}.heic"

    # Rename the file
    echo "Renaming: $file → $new_file"
    mv -- "$file" "$new_file"
done

echo "Done."
