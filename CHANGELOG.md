## [2.0.4](https://github.com/commercelayer/commercelayer-react-checkout/compare/v2.0.3...v2.0.4) (2022-10-14)


### Bug Fixes

* improve adyen drop-in integration ([6f1d3d9](https://github.com/commercelayer/commercelayer-react-checkout/commit/6f1d3d9f8d6ccacebca73180d8e076f72c126028))

## [2.0.3](https://github.com/commercelayer/commercelayer-react-checkout/compare/v2.0.2...v2.0.3) (2022-10-12)


### Bug Fixes

* improve authorization flow with Adyen drop-in ([90a0bb8](https://github.com/commercelayer/commercelayer-react-checkout/commit/90a0bb86cc7effa273540a950d07a1d776f72845))

## [2.0.2](https://github.com/commercelayer/commercelayer-react-checkout/compare/v2.0.1...v2.0.2) (2022-10-06)


### Bug Fixes

* add item_id to dataLayer for bundles ([ba991d2](https://github.com/commercelayer/commercelayer-react-checkout/commit/ba991d2b820c9665317ae219e7bfc10347d5745b))
* keep customer address selected after delivery step ([8c3ae14](https://github.com/commercelayer/commercelayer-react-checkout/commit/8c3ae14ea0f7ca985f022c0607862042c776bf2e))

## [2.0.1](https://github.com/commercelayer/commercelayer-react-checkout/compare/v2.0.0...v2.0.1) (2022-09-21)


### Bug Fixes

* Authorization calls on Adyen dropin ([d5fe2da](https://github.com/commercelayer/commercelayer-react-checkout/commit/d5fe2dad008b45257e5bab8a25667caa67189c60))

# [2.0.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.10.0...v2.0.0) (2022-09-15)


### Features

* switch Checkout to a single page application ([4ed5566](https://github.com/commercelayer/commercelayer-react-checkout/commit/4ed556624051fb30fc4f6d2fd0b2d7b702b2cbba))
* switch to pnpm package manager ([1ef9bc6](https://github.com/commercelayer/commercelayer-react-checkout/commit/1ef9bc68f7881104b8e2fa6c1290f32901e0d666)), closes [#277](https://github.com/commercelayer/commercelayer-react-checkout/issues/277)


### BREAKING CHANGES

* starting from this release only pnpm will be allowed as package manager
* Checkout is now a single page application using react-router-dom

Starting from this release Checkout Application doesn’t require anymore hosting with Nodejs capabilities. Instead of building the project it is required to export it using the command `yarn export`. It is possible to test it on local environment using `yarn serve` command.

# [1.10.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.9.0...v1.10.0) (2022-08-25)


### Features

* autoselect payment method if only one available in the market ([c6bb966](https://github.com/commercelayer/commercelayer-react-checkout/commit/c6bb9664eec8d00815bb898f2ad25fc62b1fcdf0))

# [1.9.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.8.4...v1.9.0) (2022-08-11)


### Bug Fixes

* remove error for customer wallet from order summary ([5aac2f4](https://github.com/commercelayer/commercelayer-react-checkout/commit/5aac2f48110b2f9cde5006569c08c0074f73a7a6))
* sync JWT with local storage before calling settings endpoint ([fabd92f](https://github.com/commercelayer/commercelayer-react-checkout/commit/fabd92fa7a95f9764c7f88c33d9ec8cb785a45f2))


### Features

* add payment methods support to Adyen gateway (Klarna and PayPal) ([357ae68](https://github.com/commercelayer/commercelayer-react-checkout/commit/357ae681ceca7e4f3ecd85810ac956ccf5ed3dcf))

## [1.8.4](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.8.3...v1.8.4) (2022-08-02)


### Performance Improvements

* improve GTM provider reducing API calls ([075424d](https://github.com/commercelayer/commercelayer-react-checkout/commit/075424d12e75626cfd724f291f3e8d9acf908dda))

## [1.8.3](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.8.2...v1.8.3) (2022-07-25)


### Bug Fixes

* force check slug variable on forked checkout ([7d73126](https://github.com/commercelayer/commercelayer-react-checkout/commit/7d73126453ee1d7bbfc324311e46c487548ffacd))

## [1.8.2](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.8.1...v1.8.2) (2022-07-14)


### Bug Fixes

* fire GTM add_shipping_info event with autoselect shipping method ([bfa55a5](https://github.com/commercelayer/commercelayer-react-checkout/commit/bfa55a5a40a9217ce03b6f8db6c5917ef3f778df))

## [1.8.1](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.8.0...v1.8.1) (2022-06-29)


### Bug Fixes

* count free items as line items ([04c06ce](https://github.com/commercelayer/commercelayer-react-checkout/commit/04c06ce2033ac1b88b79839fc672301e13ce9d76))

# [1.8.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.7...v1.8.0) (2022-06-16)


### Features

* add German translations ([121bd05](https://github.com/commercelayer/commercelayer-react-checkout/commit/121bd058501629092e569a1e46d70289836ef69b))

## [1.7.7](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.6...v1.7.7) (2022-06-08)


### Bug Fixes

* thank you page with data on page reload ([bcd74c9](https://github.com/commercelayer/commercelayer-react-checkout/commit/bcd74c9910a7f35e2b64e7f4a6d23977805707a0))
* use group selector on payment cards ([d5dad66](https://github.com/commercelayer/commercelayer-react-checkout/commit/d5dad667dff2de0e82db01adf73500cf63cebaf0))

## [1.7.6](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.5...v1.7.6) (2022-05-31)


### Bug Fixes

* adjust padding on message and btn on thankyou page ([392d191](https://github.com/commercelayer/commercelayer-react-checkout/commit/392d1917f99c5a2737cb405e69fdf13293836b3c))
* checkout on scenarios with free SKUs ([ae0fcd5](https://github.com/commercelayer/commercelayer-react-checkout/commit/ae0fcd58e61449f0931dd49471f7df159ce0e61b))
* disable place order button on mobile ([1a2c827](https://github.com/commercelayer/commercelayer-react-checkout/commit/1a2c8275fae1089d1803f3f4aaab7cfc7023e4bd))
* display stock transfer as stock line items ([2ed84b6](https://github.com/commercelayer/commercelayer-react-checkout/commit/2ed84b629b8b7893939b92eaae128458744808f5))
* remove empty div on active payment card ([f2690d6](https://github.com/commercelayer/commercelayer-react-checkout/commit/f2690d66902e3b1fb65d8d1a5a3112009bfe9afa))
* remove gift card from order summary when is used ([c2f5a3f](https://github.com/commercelayer/commercelayer-react-checkout/commit/c2f5a3ffd9b9f97ea9862c123dd0163a4d94544b))
* Remove react console error from error children ([6d18da4](https://github.com/commercelayer/commercelayer-react-checkout/commit/6d18da4f3ee205605766d6837f3fa85867793a14))
* set payment required applying or removing gift card on each step ([4312fcc](https://github.com/commercelayer/commercelayer-react-checkout/commit/4312fcc9fa8415943bfc4d7aa8a38dc47035cada))


### Performance Improvements

* using fetchOrder callback to get updated order from OrderContainer ([d7e66ca](https://github.com/commercelayer/commercelayer-react-checkout/commit/d7e66ca019fbb563a8425b5193c02ea7c5b3183b))

## [1.7.5](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.4...v1.7.5) (2022-05-11)


### Bug Fixes

* full width btn on thank you page for mobile ([dfebf8a](https://github.com/commercelayer/commercelayer-react-checkout/commit/dfebf8a876fb579911a05a9efe019c95397a2fb1))

## [1.7.4](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.3...v1.7.4) (2022-05-11)


### Bug Fixes

* solve a safari issue with disabled button in safari ([b8aa1fd](https://github.com/commercelayer/commercelayer-react-checkout/commit/b8aa1fda9e404ee1e60642b7de018c568c89336d))

## [1.7.3](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.2...v1.7.3) (2022-05-11)


### Bug Fixes

* allow removing or adding coupon returning from an external payment gateway page (PayPal, checkout.com) ([213134c](https://github.com/commercelayer/commercelayer-react-checkout/commit/213134c4953dd28d3bd7857c191df68940403721))
* shipping method selection for SKU with no tracking stock ([73bb1f0](https://github.com/commercelayer/commercelayer-react-checkout/commit/73bb1f0d164c62e5e2e7274f1f0806f10d41eecc))
* use available shipping method for shipments ([4317e02](https://github.com/commercelayer/commercelayer-react-checkout/commit/4317e0233c2219b97d2c13b7b7a1a025cd712049))

## [1.7.2](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.1...v1.7.2) (2022-05-09)


### Bug Fixes

* remove unit price in order summary ([573ec70](https://github.com/commercelayer/commercelayer-react-checkout/commit/573ec700114ff964f20b50487d507cebc57f76d0))

## [1.7.1](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.7.0...v1.7.1) (2022-05-05)


### Bug Fixes

* avoid double payment intent creation ([fd34f7e](https://github.com/commercelayer/commercelayer-react-checkout/commit/fd34f7e2a1c0f629806dfc924374e3b80dea14e7))
* use new component for stock transfer ([4b2cc89](https://github.com/commercelayer/commercelayer-react-checkout/commit/4b2cc89418c10abc8c05fa95af5d1caeb44cd8ae))

# [1.7.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.6.0...v1.7.0) (2022-05-03)


### Bug Fixes

* avoid uppercasing coupon once applied ([06f51ca](https://github.com/commercelayer/commercelayer-react-checkout/commit/06f51caee4ef54b4f36c2af2d4f80c46ea63b2b4))
* Clean braintree errors on coupon section ([78a9718](https://github.com/commercelayer/commercelayer-react-checkout/commit/78a97182d7dd5ec492dc540df2bbbc7863610595))
* Hide `customer_email` error on coupon code ([dac90f4](https://github.com/commercelayer/commercelayer-react-checkout/commit/dac90f4404d31fca545d04ad593498fb5d229456))
* keep line_2 field optional on touch ([f28becf](https://github.com/commercelayer/commercelayer-react-checkout/commit/f28becfc3d4bd3a7df572512866750e6626eb987))
* lineItem options style refactored ([9ca5ecd](https://github.com/commercelayer/commercelayer-react-checkout/commit/9ca5ecdbf6ce63f9f59bd4244af9057c3d804276))
* remove error if coupon input is cleared ([3c1316c](https://github.com/commercelayer/commercelayer-react-checkout/commit/3c1316c76d2c2749ceedf95f9fedd743e34f755e))
* remove price from delivery step ([fcda199](https://github.com/commercelayer/commercelayer-react-checkout/commit/fcda19973fdcc7c88aed21645c38b6f3fac4b9ee))
* select and use customer payment source ([9a4b0ef](https://github.com/commercelayer/commercelayer-react-checkout/commit/9a4b0efdd6b77344d8c7c37171b56ca6fd1265e4))


### Features

* add checkout.com session after return from 3ds ([a8d3496](https://github.com/commercelayer/commercelayer-react-checkout/commit/a8d349601e84347a672344827b94956fe7ab1939))
* add coupon and gift card errors ([6d8365f](https://github.com/commercelayer/commercelayer-react-checkout/commit/6d8365fdc75c0a2e3def46518fd82acc75bc8b7e))
* add retry for timeout in api/settings and keep url if failing on error page ([4e6cc5f](https://github.com/commercelayer/commercelayer-react-checkout/commit/4e6cc5f09d782a0c7cde6f504a6bbdf6a41fd591))
* allow coupon and gift card on the same order ([87b853e](https://github.com/commercelayer/commercelayer-react-checkout/commit/87b853e69a9e9dd7c590930e23196c649b78010a))
* Checkout dot com form customization ([6403eeb](https://github.com/commercelayer/commercelayer-react-checkout/commit/6403eeb1813bf0839a3cc0acfce24cba4b1271b5))
* save accessToken in local storage for Paypal and checkout.com return ([1052001](https://github.com/commercelayer/commercelayer-react-checkout/commit/1052001c7f024e88b6e19b665e63076167237ec3))

# [1.6.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.5.0...v1.6.0) (2022-03-28)


### Bug Fixes

* improve tax included or not in order summary ([2a0acdd](https://github.com/commercelayer/commercelayer-react-checkout/commit/2a0acdd15bbbb0cd129fa68327dad131edfc4ba9))


### Features

* add return to cart link below summary if present on order ([623d5ef](https://github.com/commercelayer/commercelayer-react-checkout/commit/623d5ef8d92a4795545b03d28b9c36e217100a76))

# [1.5.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.4.3...v1.5.0) (2022-03-17)


### Bug Fixes

* autoselect shipping method if only one available ([8694fba](https://github.com/commercelayer/commercelayer-react-checkout/commit/8694fba63597aedf54179175c64d2c9422da8400))
* avoid to show remove coupon and giftcard link on thankyou page ([71b0e4a](https://github.com/commercelayer/commercelayer-react-checkout/commit/71b0e4ad92548753d2d7a7fe9367f958ec282508))
* check for customer email if addresses already present ([a6e1a30](https://github.com/commercelayer/commercelayer-react-checkout/commit/a6e1a30c951da54ecb1b6ae7c9b9aeeb2d7dd093))
* compact duplicated errors ([2f2de65](https://github.com/commercelayer/commercelayer-react-checkout/commit/2f2de654e20ae00054fbb00e6ac13f27e2ea2338))
* open step from accordion if previous step completed ([555bfb1](https://github.com/commercelayer/commercelayer-react-checkout/commit/555bfb14f471233c87c17d82772ef0f27cc7117d))
* shipping summary same height ([03bec6c](https://github.com/commercelayer/commercelayer-react-checkout/commit/03bec6c5656f476f6291a4aa8fc20de77583aeb4))
* update ship to different address status on save ([104a15b](https://github.com/commercelayer/commercelayer-react-checkout/commit/104a15bff6aa269b6e6b40bcbcd5aa95caba6101))


### Features

* add price for item with quantity gt 1 ([c528d3d](https://github.com/commercelayer/commercelayer-react-checkout/commit/c528d3d08d95094132fcde3b73ee149aa2abe28f))


### Performance Improvements

* add DC to US states list ([3f399a4](https://github.com/commercelayer/commercelayer-react-checkout/commit/3f399a456a7001434f0b11e4e09ad4ab03cdbf34))
* switch general state to use reducer approach ([db7baa6](https://github.com/commercelayer/commercelayer-react-checkout/commit/db7baa6634307020a314496718080df722397f91))

## [1.4.3](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.4.2...v1.4.3) (2022-03-03)


### Bug Fixes

* enable automatic place order for PayPal ([c75c878](https://github.com/commercelayer/commercelayer-react-checkout/commit/c75c87849383c302207be203e04a88675d877480))

## [1.4.2](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.4.1...v1.4.2) (2022-02-25)


### Bug Fixes

* avoid resetting payment_method on paypal return ([9b0c775](https://github.com/commercelayer/commercelayer-react-checkout/commit/9b0c7752b4bcee856fd5b4b584d2aa27201c5f4d))

## [1.4.1](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.4.0...v1.4.1) (2022-02-25)


### Bug Fixes

* nullify payment method with refresh if present ([5efa1a8](https://github.com/commercelayer/commercelayer-react-checkout/commit/5efa1a8b994fac5662c04e921a83522d839bde91))

# [1.4.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.3.0...v1.4.0) (2022-02-21)


### Bug Fixes

* bump react components for email validation fix ([3f4b163](https://github.com/commercelayer/commercelayer-react-checkout/commit/3f4b163886bcc297af4ad04f279f02909af038ed))
* keep T&C checkbox on top ([0485a3c](https://github.com/commercelayer/commercelayer-react-checkout/commit/0485a3ce18b4d914bce11c9b399c27e59b9d4519))
* remove auto-fill background on input fields ([76d021d](https://github.com/commercelayer/commercelayer-react-checkout/commit/76d021df9a90d15e7155920dd4145604744b7d1b))
* remove blank spaces from support phone ([4c5a15a](https://github.com/commercelayer/commercelayer-react-checkout/commit/4c5a15a7a9c192e4576be6f8d5abe5495dd349c9))
* support mail and phone clickable on mobile ([37f2d31](https://github.com/commercelayer/commercelayer-react-checkout/commit/37f2d314dd03fbd26b052c65b30ab9bb46a5412d))


### Features

* add logic to set gtm id based on test mode ([7a6db70](https://github.com/commercelayer/commercelayer-react-checkout/commit/7a6db701313328a71d82c011e9cce04405b4f8ce))
* new official CL color palette ([bf3568a](https://github.com/commercelayer/commercelayer-react-checkout/commit/bf3568ac516e632fae3349cac20626e5938913c2))

# [1.3.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.2.0...v1.3.0) (2022-02-07)


### Bug Fixes

* avoid form rings cut off ([8ae9edc](https://github.com/commercelayer/commercelayer-react-checkout/commit/8ae9edc3974c4e556002e1933a969de2ec2bb60a))
* enable tailwind base styles ([e2836b8](https://github.com/commercelayer/commercelayer-react-checkout/commit/e2836b883b2b4941fb05db0a5cb2abb4a40783e6))
* remove error below payment if not available coupon ([8b59f52](https://github.com/commercelayer/commercelayer-react-checkout/commit/8b59f525aa8d40a2bebbf7e37bdada053be648c7))
* remove useless call for coupon calculations ([bfba97e](https://github.com/commercelayer/commercelayer-react-checkout/commit/bfba97e1ac86aa86f99c5b58b02af7457e73ecd8))
* styling shipping_address_country_code select when locked ([1800bde](https://github.com/commercelayer/commercelayer-react-checkout/commit/1800bde5882c1f71c87ddf22a7bb1efae4668fa8))
* tailwind3 unnecessary classes ([82c23a5](https://github.com/commercelayer/commercelayer-react-checkout/commit/82c23a5667fcbff55fe26c338f33903f9d96039f))


### Features

* improve order with shipping country code lock ([54171b7](https://github.com/commercelayer/commercelayer-react-checkout/commit/54171b781f910ff27f8cb132489eb58f2b9db61a))
* improve order with shipping country code lock ([f45ad5d](https://github.com/commercelayer/commercelayer-react-checkout/commit/f45ad5d64f285cb919dfa9e011c92b665fdd55cc))

# [1.2.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.1.0...v1.2.0) (2022-01-25)


### Bug Fixes

* add props for line items count ([9fe6148](https://github.com/commercelayer/commercelayer-react-checkout/commit/9fe61481546bf60c4ea67defd1ac156944490436))
* address card grows into empty space ([704c7a3](https://github.com/commercelayer/commercelayer-react-checkout/commit/704c7a3377444690a3a898e4196f91d0af477442))
* change type for customer address card ([50a7b7b](https://github.com/commercelayer/commercelayer-react-checkout/commit/50a7b7b2b31d6f58f43cbc319c401b0d3518e30c))


### Features

* add components to step complete ([3a1312d](https://github.com/commercelayer/commercelayer-react-checkout/commit/3a1312dcfdfc70e572df13ef9ac1e0f81caf2df9))
* add wire transfer translation and refactor ([934d545](https://github.com/commercelayer/commercelayer-react-checkout/commit/934d545c6b66dbd78898e2eaf4b075b3b6bbf8a9))
* improve thank you with translations, free payment, no ship ([5ceb3cc](https://github.com/commercelayer/commercelayer-react-checkout/commit/5ceb3cc5162136dd73b494c50ba88065b29e30e3))
* New thank you page layout ([cc700ac](https://github.com/commercelayer/commercelayer-react-checkout/commit/cc700ace4ecedfda70e922a31eeeba62720dae30))
* order recap on thank you page ([e36a544](https://github.com/commercelayer/commercelayer-react-checkout/commit/e36a544d37815d8ddc4d09dad9c2b6cc90a00647))


### Performance Improvements

* speed up checkout bootstrap ([b375f19](https://github.com/commercelayer/commercelayer-react-checkout/commit/b375f19687598e7ab9bca42799003f8b57b10f4f))
* upgrade to react-components v3 without cities.json ([ed3e3bf](https://github.com/commercelayer/commercelayer-react-checkout/commit/ed3e3bf4f009a44f46f89747fd0889129138d754))

# [1.1.0](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.0.1...v1.1.0) (2022-01-18)


### Bug Fixes

* avoid checkout error when refreshing quickly ([9955768](https://github.com/commercelayer/commercelayer-react-checkout/commit/9955768b75f4d54a88b30465fc0724cdc99b59cc))
* checkout an order with only bundles ([7435acc](https://github.com/commercelayer/commercelayer-react-checkout/commit/7435acc11102d6235d20242c58a42482c51cc243))
* ignore build error in test files ([1ab6dbf](https://github.com/commercelayer/commercelayer-react-checkout/commit/1ab6dbf6fee77ee3f18aaa0cea9103bfcc234b43))
* show multiple bundles on the same order ([8219cfb](https://github.com/commercelayer/commercelayer-react-checkout/commit/8219cfb30c2990bc2b225c2c65134f19f53a87a1))


### Features

* add support to bundles ([f48b2e1](https://github.com/commercelayer/commercelayer-react-checkout/commit/f48b2e12285fc066f3c0f897fd6cdacd9a2ccdf4))

## [1.0.1](https://github.com/commercelayer/commercelayer-react-checkout/compare/v1.0.0...v1.0.1) (2021-12-31)


### Bug Fixes

* Slug control is actived when the checkout is hosted by Commerce Layer ([b0c6ec7](https://github.com/commercelayer/commercelayer-react-checkout/commit/b0c6ec789ddcd130bd7c65ad56a70d401a6aa048))

# 1.0.0 (2021-12-29)


### Bug Fixes

* add isShipmentRequired to OrderSummary to check ShippingAmount visibility ([d9b18c3](https://github.com/commercelayer/commercelayer-react-checkout/commit/d9b18c32b537a21e132b035612788a981ebc9726))
* badge logic ([337dd7e](https://github.com/commercelayer/commercelayer-react-checkout/commit/337dd7ed34b9455be8c2380431d3ea990214d66e))
* Braintree styles ([faa01a6](https://github.com/commercelayer/commercelayer-react-checkout/commit/faa01a6512cf14a9036891973e0e2b35680c3671))
* customer address duplicate ([1f58d02](https://github.com/commercelayer/commercelayer-react-checkout/commit/1f58d02efa43fa8b10f74fc7612e2dac49ccc0b2))
* customer form/addresses animation ([7892d80](https://github.com/commercelayer/commercelayer-react-checkout/commit/7892d809f9568b0b0193547d91c4001f25946799))
* deliveryLeadTime prop ([a628057](https://github.com/commercelayer/commercelayer-react-checkout/commit/a628057a8ea7b52289b63ff2533c9ed7b140791e))
* Development by localhost ([d9c2eb5](https://github.com/commercelayer/commercelayer-react-checkout/commit/d9c2eb57a7c51d88c996531077c9dd7279ff22c8))
* disable address button if customer email is empty ([ef8c41b](https://github.com/commercelayer/commercelayer-react-checkout/commit/ef8c41b2cd5a870d7c7cd0a76d093851e7356b3f))
* domain to commercelayer sdk ([0091e23](https://github.com/commercelayer/commercelayer-react-checkout/commit/0091e231fa51a86bd081eca9c5550cde8463a4e9))
* Footer & Place order position ([b866dc3](https://github.com/commercelayer/commercelayer-react-checkout/commit/b866dc3ed6ba65b099896199bd2ac037dff52c7e))
* Footer margin ([411441a](https://github.com/commercelayer/commercelayer-react-checkout/commit/411441a93024561c2925cb477ba0b53717615f24))
* footer mobile ([8b8da0c](https://github.com/commercelayer/commercelayer-react-checkout/commit/8b8da0c676efc3205e6689773db79e8bf1a8e3ea))
* footer mobile ([a875606](https://github.com/commercelayer/commercelayer-react-checkout/commit/a87560605c59eac622d82b8145f27a93aa0d227d))
* Footer prop ([ed05517](https://github.com/commercelayer/commercelayer-react-checkout/commit/ed0551759a2fa45ea848ee230732c836ad227660))
* input class with shadow fill plugin ([f3d86fc](https://github.com/commercelayer/commercelayer-react-checkout/commit/f3d86fc8561e43734acfb639b82b01e9e1b73668))
* label for state and country inputs ([12a1841](https://github.com/commercelayer/commercelayer-react-checkout/commit/12a18413d76e0daf90c3f0483da79442dda7eca8))
* multple errors for the same field and temporarily add scroll from the customer step to delivery step when save address ([0345d40](https://github.com/commercelayer/commercelayer-react-checkout/commit/0345d40892fa9f7ac97457b461c878e1cc088581))
* Node engine version ([667ffeb](https://github.com/commercelayer/commercelayer-react-checkout/commit/667ffebc56187188e26205be44dfc5981f03cff2))
* order test ([f9057b9](https://github.com/commercelayer/commercelayer-react-checkout/commit/f9057b9bdf21315cc48e6106c04264705e01ee20))
* payment test ([d82901d](https://github.com/commercelayer/commercelayer-react-checkout/commit/d82901d44bd9b8ad2406917eb728715dcba8f286))
* paypal working returning url ([33e14d2](https://github.com/commercelayer/commercelayer-react-checkout/commit/33e14d266f5706c549cbfcba509586378c272059))
* place order button mobile ([af1f139](https://github.com/commercelayer/commercelayer-react-checkout/commit/af1f139a72ead46a0e3eae095dfeb89f43d0199b))
* prevent click on accordion if step not activable ([2a299eb](https://github.com/commercelayer/commercelayer-react-checkout/commit/2a299eb7e79ddce81be604346978cd2a5456c9ec))
* props ([718297a](https://github.com/commercelayer/commercelayer-react-checkout/commit/718297a8c47b02f668230486570155514f51397c))
* province label and sorting ([ae0457d](https://github.com/commercelayer/commercelayer-react-checkout/commit/ae0457dc1902602d703344c996981bdc84a9bcf6))
* remove adjustments from GTM provider ([5945d61](https://github.com/commercelayer/commercelayer-react-checkout/commit/5945d61dbe8b914ca0b7f67b85583f2884f5ad20))
* remove as to prop ([286c66e](https://github.com/commercelayer/commercelayer-react-checkout/commit/286c66ed1b577e43e7e47c97e322b367bdfe5c35))
* shadow-inner for state input ([759bc3c](https://github.com/commercelayer/commercelayer-react-checkout/commit/759bc3cf5513057a56a361aabcd90883e29b7805))
* step flow ([d113c5e](https://github.com/commercelayer/commercelayer-react-checkout/commit/d113c5e3515403f884895dc5eadf613adebf56fd))
* test ([11208f3](https://github.com/commercelayer/commercelayer-react-checkout/commit/11208f3c16d515876555ee44e0bb2052819b161f))
* test and @commercelayer/react-components ([51f7e00](https://github.com/commercelayer/commercelayer-react-checkout/commit/51f7e0022af8eefd1ef9ac0a45a38c09f3b82614))
* Tests ([a298cab](https://github.com/commercelayer/commercelayer-react-checkout/commit/a298cab119fe2e0f62146942f9bb155722795900))
* update select and input for state ([9202b75](https://github.com/commercelayer/commercelayer-react-checkout/commit/9202b7587dd903164a532b37efd9342d61c45131))
* use new props and fix autofill shadow only for webkit ([901fc40](https://github.com/commercelayer/commercelayer-react-checkout/commit/901fc405bb808ef8a82603f6b804cfb82b323afe))


### Features

* add cache control and remove timestamp to api ([bfa2ea6](https://github.com/commercelayer/commercelayer-react-checkout/commit/bfa2ea67c7b6129cf29cd4c9a9c05aa60f84586e))
* add condition deliveryLeadTime and fix tests ([c74affd](https://github.com/commercelayer/commercelayer-react-checkout/commit/c74affd80865994de146e4bb85dc92a0fc859f85))
* add headlessui ([c5f25b7](https://github.com/commercelayer/commercelayer-react-checkout/commit/c5f25b7417e45fc1e6d1976ae46b9a801fb6467a))
* add mount form state ([0f4c8bc](https://github.com/commercelayer/commercelayer-react-checkout/commit/0f4c8bcd03b02965b2a67148224896c8f4ce513b))
* add payment accordion message when amount zero, add case shipping not required the step not visible, fix when shipping amount is zero not visible to recap, add getStepNumber and fix test ([8085ab3](https://github.com/commercelayer/commercelayer-react-checkout/commit/8085ab32e1f23a54a057dd80a017f959ac5206d4))
* add prop isActive to StepPlaceOrder ([516bb31](https://github.com/commercelayer/commercelayer-react-checkout/commit/516bb3174a463e099a684d48339cf3004e2492c2))
* add refetchShipments ([946d2fc](https://github.com/commercelayer/commercelayer-react-checkout/commit/946d2fc548a924d789d6ff21df2e0b643143d6f7))
* add sdk ([0ada2d2](https://github.com/commercelayer/commercelayer-react-checkout/commit/0ada2d2d1e492a8472763d6e409148b7a23f1bf5))
* add style to shipping title ([3c6fe35](https://github.com/commercelayer/commercelayer-react-checkout/commit/3c6fe359b891288ef2e66598e0a0a1708aeb85b6))
* add tax included ([519ddce](https://github.com/commercelayer/commercelayer-react-checkout/commit/519ddce72736e4d4a358ba06818d6f4ec55c1819))
* adjustment ([0c82d8d](https://github.com/commercelayer/commercelayer-react-checkout/commit/0c82d8d9dc4f49817dfd538af0a34d877bab7b66))
* autorefresh condition ([9617e98](https://github.com/commercelayer/commercelayer-react-checkout/commit/9617e98cea984ad0660edaf7c5cd1d21869826ed))
* change customer step header information and fix test ([65b441a](https://github.com/commercelayer/commercelayer-react-checkout/commit/65b441a484467c13f3d3cecc75317bb529d24a43))
* fix summary shipping and tax ([daddf81](https://github.com/commercelayer/commercelayer-react-checkout/commit/daddf8165b724a51e8f21a7cfd0d0bde9be5b69c))
* link button mobile ([defada7](https://github.com/commercelayer/commercelayer-react-checkout/commit/defada76d9af6c9e830dd69444bd71c3fee5d770))
* new address form bottom component ([76c0c91](https://github.com/commercelayer/commercelayer-react-checkout/commit/76c0c91779eb0f6eb2671bd85d44673ec5b3b514))
* next V12 ([2674bef](https://github.com/commercelayer/commercelayer-react-checkout/commit/2674befff695b615bada7db4bdd2c8cb3f9cac2d))
* place order button visible only when activeStep is Complete ([e84445e](https://github.com/commercelayer/commercelayer-react-checkout/commit/e84445eb90d14d6509fde5ed70667cba1f17e2c9))
* remove mobile check scroll form ([6757045](https://github.com/commercelayer/commercelayer-react-checkout/commit/6757045c9ecfa03c960388c90e37aeef73c9c81f))
* remove prop footer to layout ([a60abd2](https://github.com/commercelayer/commercelayer-react-checkout/commit/a60abd291209bc60c8faea336c8911091dcd328a))
* scroll form mobile only ([6bac39f](https://github.com/commercelayer/commercelayer-react-checkout/commit/6bac39f314c6f12a8851aefef0d4cb707dd64d0a))
* show place order button always on mobile ([2749290](https://github.com/commercelayer/commercelayer-react-checkout/commit/2749290a53fbe84a11db0ceff03c6a6ebdf44e4a))
* step shipment information when there is only one shipment and fix tests ([3fc2a9e](https://github.com/commercelayer/commercelayer-react-checkout/commit/3fc2a9e11bd1c53058185e9baff1ae59dea841fd))
* sticky button & footer mobile/desktop ([77e6701](https://github.com/commercelayer/commercelayer-react-checkout/commit/77e6701de1f5f7d73c0c7fd9354dd671af47f962))
* upgrade @commercelayer/react-components ([82719a2](https://github.com/commercelayer/commercelayer-react-checkout/commit/82719a24cc7336927f60f2046747c77498ef74c1))
* upgrade react-components ([c54213e](https://github.com/commercelayer/commercelayer-react-checkout/commit/c54213e73ec517c1b5e97565d372333ab6c1013a))
* upgrade react-components ([8070fd8](https://github.com/commercelayer/commercelayer-react-checkout/commit/8070fd89b143ba7443de68e7f0b93467540d7b69))
* upgrade SDK and react-components ([1b779ae](https://github.com/commercelayer/commercelayer-react-checkout/commit/1b779aeacd1e590ac631f282eb10955672fdfe69))


### Performance Improvements

* build [orderId] first load ([1fffb87](https://github.com/commercelayer/commercelayer-react-checkout/commit/1fffb87d47e78212bd6aa9ac14177c968ba40665))
* decrease loading time by using dynamic imports ([edeee07](https://github.com/commercelayer/commercelayer-react-checkout/commit/edeee0742cc00f2690f4b0f2b81d0e756df59533))
