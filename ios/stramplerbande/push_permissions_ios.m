//
//  push_permissions_ios.m
//  stramplerbande
//
//  Created by Виталий Паньков on 08/11/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

// Counter.m
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Counter, NSObject)
RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)
RCT_EXTERN_METHOD(increment)
RCT_EXTERN_METHOD(test)
RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)
@end
