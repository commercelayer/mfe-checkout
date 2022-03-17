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
