import sys
import os
import glob
import argparse

from pathlib import Path

def update_entry_points(project):

    conda_prefix = os.environ["CONDA_PREFIX"]

    try:
        if sys.platform == "darwin":
            print("darwin")
            entrypoints_src_path = (
                f"{conda_prefix}/lib/python*/site-packages/{project}-*info/entry_points.txt"
            )
            entrypoints_dst_path = f"{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt"
        elif sys.platform == "linux":
            print("linux")
            entrypoints_src_path = (
                f"{conda_prefix}/lib/python*/site-packages/{project}-*info/entry_points.txt"
            )
            entrypoints_dst_path = f"{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt"
        else:
            # print("windows")
            entrypoints_src_path = (
                f"{conda_prefix}/lib/site-packages/{project}-*info/entry_points.txt"
            )
            entrypoints_dst_path = (
                f"{conda_prefix}/lib/site-packages/setuptools-*info/entry_points.txt"
            )
    except Exception as e:
        print(f"unable to get entry points src/dst: {e}")

    print(f"globbing from {entrypoints_src_path} to {entrypoints_dst_path}")

    entrypoints_src = glob.glob(entrypoints_src_path)[0]
    entrypoints_dst = glob.glob(entrypoints_dst_path)[0]

    entry_points = []
    start_getting_entries = False
    with open(entrypoints_src, "r") as f:
        for line in f:
            if f"[{project}.flowsheets]" in line:
                start_getting_entries = True
            elif start_getting_entries == True and ("]" in line or line == None or line == "\n"):
                print(f"reached end of entry points, breaking")
                break
            elif start_getting_entries:
                entry = line.replace("\n", "")
                if line is not None:
                    entry_points.append(entry)
                else:
                    print(f"line is none, breaking")

    ## if entry points for this project exist, remove current set of entry points
    entrypoints_dst_str = ""
    found_entrypoints = False
    with open(entrypoints_dst, "r") as f:
        for line in f:
            if f"[{project}.flowsheets]" in line:
                found_entrypoints = True
            elif found_entrypoints == True and (line == None or line == "\n"):
                found_entrypoints = False
            elif found_entrypoints:
                entry = line.replace("\n", "")
            else:
                entrypoints_dst_str+=line

    ## add in entrypoints from the list
    entrypoints_dst_str+=f"\n\n[{project}.flowsheets]"
    for each in entry_points:
        entrypoints_dst_str+=f"\n{each}"

    ## write this string to the dst path
    with open(entrypoints_dst, "w") as f:
        f.write(entrypoints_dst_str)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--project", help="Project to search for entry points. If not provided, default is WaterTAP.")
    args = parser.parse_args()
    project = args.project
    if project is None:
        project = "watertap"
    elif project.lower() == "idaes":
        project = "idaes_pse"
    else:
        project = project.lower()
    update_entry_points(project)
    