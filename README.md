# SuperSimpleMetronome
A barebones React Native metronome app without any bloat. Made for some learning experience. Use at your own risk. It does support the following features:
* Dynamic theme change by device color scheme changes
* Input validation
* BPM and beat number modifications

## Installation
You can either install the `.apk` from releases or download the source code and compile it yourself. The project is built using [yarn](https://yarnpkg.com/) and React Native with [expo framework](https://docs.expo.dev/). Check the [EAS Documentation](https://docs.expo.dev/build/setup/) for more information about building from source. It may also be compiled for IOS as well, but I haven't tried it myself. 

## Current Limitations
On higher BPM levels, the beating sound may get out of sync. Because of it, the BPM is limited to be less than 250. The codebase is also messy, which I will refactor it in the future. As the scope of this project is for experience. I'll leave it like this for now. 

## License
The source code is made available under the MIT license. But some of the dependencies may be licensed differently.
