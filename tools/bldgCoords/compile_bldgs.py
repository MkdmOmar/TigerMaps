#
# This file parses all building data files in the directories listed below.
# You can find sample building file formats in the files
# "sample_bldg" and "sample_bldg2"
# It's basically the same format we were using for the
# first building data we gathered.
#
# To run this script, simply do "python compile_bldgs.py".
# It will output a bldgCoords.js file.
#
# Note that this script and all the building data files are NOT in any way
# part of the actual application. They are simply simpler ways for us to
# collect and compile all the building data in any way we need.
#

import sys
import os

# Names of the directories with the building files.
# These must be in the same directory as this script.
directories = ["Jelani", "Jose", "Omar", "Osama"]

# Simple check for duplicates.
# Elements with the same indices correspond.
bldgNameList = []
bldgPathList = []

# Format of the bldgCoords.js file as a whole.
bldgCoordsPrototype = """var locations = [
{}
];"""

# Format of each building data entry in "locations" in the bldgCoords.js file.
bldgDataPrototype = """{{
\tname: "{}",
\tcoords: {}
}}"""

def indent(string, tabs):
    result = ""
    for line in string.splitlines():
        result += ("\t" * tabs) + line + "\n"

    return result[:-1]

def format_coords(string, filepath):
    """
    Format the actual building polygon coordinates appropriately.
    Prints out some warnings if files are incorrectly formatted,
    but does NO checking on the actual coordinates themselves.
    """
    try:
        bracket1 = 0
        while string[bracket1] != "[":
            bracket1 += 1

        bracket2 = bracket1 + 1
        while string[bracket2] != "[" and string[bracket2] != "]":
            bracket2 += 1

        if string[bracket2] == "]":
            # No holes in the building
            coords = string[(bracket1+1):bracket2].strip()
            coords = indent(coords, 1)
            result = "[\n" + coords + "\n]"
            result = indent(result, 2).strip()
            return result
        elif string[bracket2] == "[":
            # Holes in the building, things get messier
            between = string[(bracket1+1):bracket2]
            if not (len(between) == 0 or between.isspace()):
                print "WARNING: text between [ and [ in", filepath

            bracket3 = bracket2 + 1
            while string[bracket3] != "]":
                bracket3 += 1
            coordsOuter = string[(bracket2+1):bracket3].strip()
            coordsOuter = indent(coordsOuter, 1)

            bracket4 = bracket3 + 1
            while string[bracket4] != "[":
                bracket4 += 1
            between = string[(bracket3+1):bracket4]
            if not between.strip() == ",":
                print "WARNING: text other than comma between ] and [ in", filepath

            bracket5 = bracket4 + 1
            while string[bracket5] != "]":
                bracket5 += 1
            coordsInner = string[(bracket4+1):bracket5].strip()
            coordsInner = indent(coordsInner, 1)

            bracket6 = bracket5 + 1
            while string[bracket6] != "]":
                bracket6 += 1
            between = string[(bracket5+1):bracket6]
            if not (len(between) == 0 or between.isspace()):
                print "WARNING: text between ] and ] in", filepath

            result = "[\n" + coordsOuter + "\n],\n[\n" + coordsInner + "\n]"
            result = indent(result, 1)
            result = "[\n" + result + "\n]"
            result = indent(result, 2).strip()
            return result
    except:
        print "ERROR IN", filepath

def parse_bldg_data(filepath):
    """
    Parse building data from file. Return formatted string.
    """
    with open(filepath, "r") as file:
        name = file.readline()[:-1]
        if name in bldgNameList:
            ind = bldgNameList.index(name)
            print "WARNING: duplicate building name \"" + name + "\"" \
                + "in files", filepath, "and", bldgPathList[ind]
        bldgNameList.append(name)
        bldgPathList.append(filepath)
        coords = format_coords(file.read(), filepath)
        return bldgDataPrototype.format(name, coords)

def compile():
    result = ""
    for directory in directories:
        currentPath = os.path.normpath(os.path.dirname(__file__))
        dirpath = os.path.join(currentPath, directory)
        for filename in os.listdir(dirpath):
            filepath = os.path.join(dirpath, filename)
            result += parse_bldg_data(filepath) + ",\n"

    return result[:-2]

if __name__ == "__main__":
    locations = compile()
    with open("bldgCoords.js", "w+") as outfile:
        outfile.write(bldgCoordsPrototype.format(locations))
