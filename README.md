# secure-cycle
A secure period and symptom tracking app powered by OpenTDF

#Installation And First Run
To install and run secure-cycle locally in xcode (ios) please follow the steps bellow

1. Run `npm install` from the root directory.
2. Run `cd ios` to navigate to the ios directory
3. Run `bundle install`. This will install a specific version of Ruby to _only_ this project folder. This will avoid conflicts will the Macos default version of ruby, while keeping your development environment clean
4. Run `pod install` to install the needed pod dependencies
5. Open Xcode -> ios/SecureCycle.xcworkspace. NOTE: Do not try to open SecureCycle.xcodeproj. Opening the xcode proj will result in build errors as xcode will not be able to locate your installed pods. This is a common mistake when working with `react-native` for the first time.
6. Press the play button!
