//
//  push_permissions_ios.swift
//  stramplerbande
//
//  Created by Виталий Паньков on 08/11/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import UserNotifications

@objc(Counter)
class Counter: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(addEvent:location:date:)
  func addEvent(name: String, location: String, date: NSNumber) -> Void {
    // Date is ready to use!
  }
  private var count = 0
  @objc
  func increment() {
    count += 1
    print("count is \(count)")
  }
  @objc
  func test() ->  [String: Any]! {
    count += 1
    print("count is \(count)")
    return ["someKey": "someValue"]
  }
  @objc
  func constantsToExport() -> [String: Any]! {
    return ["someKey": "someValue"]
  }
  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
   let deviceToken = UserDefaults.standard.string(forKey: "deviceToken")
    callback([deviceToken])
  }
}
