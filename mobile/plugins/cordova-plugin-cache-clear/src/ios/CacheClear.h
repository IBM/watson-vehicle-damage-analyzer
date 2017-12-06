#import <Foundation/Foundation.h>

#import <Cordova/CDVPlugin.h>

#import "AppDelegate.h"

@interface CacheClear : CDVPlugin
{
}

- (void)task:(CDVInvokedUrlCommand *)command;

// retain command for async repsonses
@property(nonatomic, strong) CDVInvokedUrlCommand *command;

@end
