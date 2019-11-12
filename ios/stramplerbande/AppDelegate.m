/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@import UIKit;
@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"stramplerbande"
                                            initialProperties:nil];
  
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [FIRApp configure];
  
  NSLog(@"Remote notification register");
  // Register for remote notifications.
   UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound;
      [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
  [application registerForRemoteNotifications];
  return YES;
}

- (void)applicationDidFinishLaunching:(UIApplication *)app {
    // Configure the user interactions first.
//    [self configureUserInteractions];
 NSLog(@"Remote notification register");
   // Register for remote notifications.
    [[UIApplication sharedApplication] registerForRemoteNotifications];
}
 
// Handle remote notification registration.
- (void)application:(UIApplication *)app
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 NSUInteger length = deviceToken.length;
    // if (length == 0) {
    //     return nil;
    // }
    const unsigned char *buffer = deviceToken.bytes;
    NSMutableString *hexString  = [NSMutableString stringWithCapacity:(length * 2)];
    for (int i = 0; i < length; ++i) {
        [hexString appendFormat:@"%02x", buffer[i]];
    }
  NSLog(@"Token updated: %@", hexString);
  [[NSUserDefaults standardUserDefaults] setObject: hexString forKey:@"deviceToken"];
  [[NSUserDefaults standardUserDefaults]synchronize];
}
 
- (void)application:(UIApplication *)app
        didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
    // The token is not currently available.
    NSLog(@"Remote notification support is unavailable due to error: %@", err);
//    [self disableRemoteNotificationFeatures];
}
// + (NSString *)stringFromDeviceToken:(NSData *)deviceToken {
//     NSUInteger length = deviceToken.length;
//     if (length == 0) {
//         return nil;
//     }
//     const unsigned char *buffer = deviceToken.bytes;
//     NSMutableString *hexString  = [NSMutableString stringWithCapacity:(length * 2)];
//     for (int i = 0; i < length; ++i) {
//         [hexString appendFormat:@"%02x", buffer[i]];
//     }
//     return [hexString copy];
// }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
