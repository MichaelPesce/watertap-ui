import sys
import os
from idaes.util.download_bin import download_binaries
from idaes.config import default_binary_release
from pathlib import Path

def check_for_extensions():
    print('checking for extensions')
    extensions_dir = Path.home() / ".watertap" / ".idaes"
    found_extensions = os.path.exists(extensions_dir)
    print(f'found extensions: {found_extensions}')
    return found_extensions

def get_extensions():
    print('inside get extensions')
    try:
        if(sys.platform == "darwin"):
            #XXX doesnt work on idaes 2.0.0 - unsupported darwin-x86_64
            print('mac')
            print('trying to download binaries')
            download_binaries(url=f'https://idaes-extensions.s3.us-west-1.amazonaws.com/')
            print(f'extensions have been gotten, making directory')

        else:
            print('not mac')
            print(f'trying to download binaries')
            download_binaries(release=default_binary_release)
            print(f'extensions have been gotten')
        print('successfully installed idaes extensions')
    except Exception as e:
        print(f'unable to install extensions: {e}')
        return False
    extensions_dir = Path.home() / ".watertap" / ".idaes"
    extensions_dir.mkdir(parents=True, exist_ok=True)
    return True

if not check_for_extensions():
    get_extensions()