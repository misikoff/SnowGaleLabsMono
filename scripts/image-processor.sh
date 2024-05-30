#!/bin/bash

# Set the input directory where you want to process files
input_directory="/Users/misikoff/Documents/training/workout\ app/pics/alphabetical"

# Set the output directory where you want to save the processed files
output_directory="./out"

# Create the output directory if it doesn't exist
mkdir -p "$output_directory"

# Iterate over files in the input directory
for file in /Users/misikoff/Documents/training/workout\ app/pics/alphabetical/*.PNG; do
# for input_file in $input_directory/*; do
  echo 'wow'
  echo "$file"
  # Check if the item is a file (not a directory)
  if [ -f "$file" ]; then
    # Extract the file name and extension
    file_name=$(basename "$file")
    file_base="${file_name%.*}"

    # Set the output file path
    output_file="$output_directory/$file_base.txt"

    # Run the Tesseract command
    tesseract "$file" "$output_file"

    # Optionally, you can print a message for each file processed
    echo "Processed: $file -> $output_file"
  fi
done
