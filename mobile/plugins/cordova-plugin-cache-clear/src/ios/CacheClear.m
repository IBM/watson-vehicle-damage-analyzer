#import "CacheClear.h"

@implementation CacheClear

@synthesize command;

- (void)task:(CDVInvokedUrlCommand *)command
{
    NSLog(@"Cordova iOS CacheClear() called.");

    self.command = command;

    // Arguments arenot used at the moment.
    // NSArray* arguments = command.arguments;

    [self.commandDelegate runInBackground:^{
      [[NSURLCache sharedURLCache] removeAllCachedResponses];
      [self success];
    }];
}

- (void)success
{
    NSString *resultMsg = @"Cordova iOS webview cache cleared.";
    NSLog(@"%@", resultMsg);

    // create acordova result
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                messageAsString:[resultMsg stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];

    // send cordova result
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)error:(NSString *)message
{
    NSString *resultMsg = [NSString stringWithFormat:@"Error while clearing webview cache (%@).", message];
    NSLog(@"%@", resultMsg);

    // create cordova result
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                messageAsString:[resultMsg stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];

    // send cordova result
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end
