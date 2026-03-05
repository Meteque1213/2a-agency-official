const registryData = [
    {
        "name": "Hermès",
        "score": 98,
        "category": "Leather Goods",
        "hash": "0x85f4a873e87aa3eaf7f36517d4805b9c1ba20c62a28599637dc221c9c8141faa"
    },
    {
        "name": "Patek Philippe",
        "score": 97,
        "category": "Watches",
        "hash": "0xd3a40e0413b66fb1a059a1cf79ffe57a80ceda79d7405d82576e84ca1394db64"
    },
    {
        "name": "Loro Piana",
        "score": 96,
        "category": "Fashion",
        "hash": "0x80978e184ab156d0ddeed49d741610c28a4e6523e432df62069a62e4be350fd9"
    },
    {
        "name": "Brunello Cucinelli",
        "score": 95,
        "category": "Fashion",
        "hash": "0x44f3276cfe7a081e00becfdad9d2e2f171b91ad588479f0a0b2fcd73ca876d3b"
    },
    {
        "name": "Cartier",
        "score": 95,
        "category": "Jewelry",
        "hash": "0x5e836d2432cb24fabc7240c24f3ebb59bc75a557c05f9620e2a397b2316d1e0d"
    },
    {
        "name": "Rolex",
        "score": 94,
        "category": "Watches",
        "hash": "0xad2982f022b882e089a231085bf111d99e153a51b91ec57cbae1b3bd95c421d0"
    },
    {
        "name": "Vacheron Constantin",
        "score": 94,
        "category": "Watches",
        "hash": "0x61ede97c4a2b430577a386766db09bafcf7107a025df2159100a189204bcf1c7"
    },
    {
        "name": "Van Cleef & Arpels",
        "score": 93,
        "category": "Jewelry",
        "hash": "0xe7ff30a0fd2075e007c95076da97262f7b56196031743e90513b2ea81d059b64"
    },
    {
        "name": "Audemars Piguet",
        "score": 93,
        "category": "Watches",
        "hash": "0x7680fb02cee15dde1e8f170781d05e181aded39bde54cb08ca1fa17fb3c1fdcd"
    },
    {
        "name": "Ferrari",
        "score": 92,
        "category": "Automotive",
        "hash": "0x8c4d0982b7fcefad2e50fc33247456af1a59428ea37ace1273e3ef6342b85e2c"
    },
    {
        "name": "Aman Resorts",
        "score": 92,
        "category": "Hotels",
        "hash": "0xf1b78de5473bbb0438364a62fce584dd5658e84bd7489dda37837d7132f28bd7"
    },
    {
        "name": "Chanel",
        "score": 91,
        "category": "Fashion",
        "hash": "0x46a9d5fa9428ff947e7a5c426e37c85e9763bb42774c099bd82d7bbaea528753"
    },
    {
        "name": "Louis Vuitton",
        "score": 90,
        "category": "Fashion",
        "hash": "0x09a333f3bd0fc034b22a22d02b5ca38e6c8d1fc2c3275f9520bd3ee05c1e5081"
    },
    {
        "name": "Breguet",
        "score": 90,
        "category": "Watches",
        "hash": "0xffed5f934d8c7958145af52c3a5e53ea9b0769358d17659b3d5792f712a78ccb"
    },
    {
        "name": "Dior",
        "score": 89,
        "category": "Fashion",
        "hash": "0x5526c731ff1775b668da78c6379bf29058ccd95f479bd624a892d3530abc436d"
    },
    {
        "name": "Oetker Collection",
        "score": 89,
        "category": "Hotels",
        "hash": "0x3cccc30a75b5b01faf091e8e85dcf6d3fb0d48397e667e419aac2a810b74dde2"
    },
    {
        "name": "Riva Yachts",
        "score": 89,
        "category": "Yachting",
        "hash": "0xe65b242063ff4de9beb0f8518ce8f423de431ddac020959354e0f4d86f7ed5db"
    },
    {
        "name": "Clarridge's",
        "score": 89,
        "category": "Hotels",
        "hash": "0xcd703041dcd177469129418110be07ab252182d992091b98a61663dc89666ea7"
    },
    {
        "name": "Louis XIII",
        "score": 89,
        "category": "Spirits",
        "hash": "0xfce1085ab225383f0933fb13902511158d32019b44760ec1d6532f96bf7f3052"
    },
    {
        "name": "Dom Pérignon",
        "score": 86,
        "category": "Spirits",
        "hash": "0x6f88dde1f40c761685fb07e2e7b8fd9de6352c5e21b882666da59bd04646273c"
    },
    {
        "name": "Bentley",
        "score": 88,
        "category": "Automotive",
        "hash": "0xfd7916796c80b49bf2f7acd399fd6e79934978769f486acd9c2a2c1367ab7ef6"
    },
    {
        "name": "Rolls-Royce",
        "score": 88,
        "category": "Automotive",
        "hash": "0x1caaa25048313aa2a5360319edd7c5c7b64fcbe010e35fbf48aef683e6555aa6"
    },
    {
        "name": "Leica",
        "score": 88,
        "category": "Tech",
        "hash": "0xa36a7df2b43fc697d30b6e5ab3eb2d754c1e0a7f9029c176d8144a624fab199f"
    },
    {
        "name": "Hôtel de Crillon",
        "score": 88,
        "category": "Hotels",
        "hash": "0xa565c7497e39f78744c72f4a0a2ce6db76e684ad7b81049d6afb26264e9b27c4"
    },
    {
        "name": "Maybourne Hotel Group",
        "score": 88,
        "category": "Hotels",
        "hash": "0xdacb47a672e39848cface820fe8fcb7b84b0afaa916d78c45c8bbb1a33c85ac9"
    },
    {
        "name": "Lürssen Yachts",
        "score": 87,
        "category": "Yachting",
        "hash": "0xa378dc1c3d9b2c505538f6e959b82ff9cb79fe2a2bc6f1c8cc99651da8782774"
    },
    {
        "name": "Boucheron",
        "score": 87,
        "category": "Jewelry",
        "hash": "0x958835fe8fc19e8264a737bd5b12caf8100cf4ed442cd1216f5ae2b97ac30f51"
    },
    {
        "name": "Belmond",
        "score": 87,
        "category": "Hotels",
        "hash": "0xde922004ab8a2c7c8a4727c6b4e21cc0731e360f7005e794e2d20ee3ac66abac"
    },
    {
        "name": "Eden Rock",
        "score": 87,
        "category": "Hotels",
        "hash": "0x144e58bfb680246f8666f3354bcb51ac289c74c130e3ca41fe54d632ddf56212"
    },
    {
        "name": "Feadship",
        "score": 86,
        "category": "Yachting",
        "hash": "0x2cc4ab009d1ebad9bd2fff9cb0874f72a4a9690cf479f92bf5df0bdf4b1ef4ab"
    },
    {
        "name": "Assouline",
        "score": 86,
        "category": "Publishing",
        "hash": "0xec2891540c3ef08a4a7d9b721d220900f037339b0b998a04d47d633394d7963d"
    },
    {
        "name": "Krug",
        "score": 85,
        "category": "Spirits",
        "hash": "0xebbb61866730ce2cd4575dde350251c5cf0eada4b1607a623447a1b08105dfb1"
    },
    {
        "name": "Steinway & Sons",
        "score": 85,
        "category": "Instruments",
        "hash": "0xcf2bfe96deac40e8484000655594516bd2a4af9fef43fd345cddcc1a44374030"
    },
    {
        "name": "Dassault Falcon",
        "score": 85,
        "category": "Aviation",
        "hash": "0x1e5f61a76d4be3ec947265a64d96200a4baad9d9b4b0b729643a9429a53f0cb4"
    },
    {
        "name": "Rosewood",
        "score": 85,
        "category": "Hotels",
        "hash": "0x7350d4ec4e84aa23c529e7c57d7ba8735ebecd41a28b9743fb8722e894476cb1"
    },
    {
        "name": "Berluti",
        "score": 84,
        "category": "Leather Goods",
        "hash": "0x2dcb245980b32d55590fbf8b627c5b36531045b4e2c3934584ed766367ede562"
    },
    {
        "name": "NetJets",
        "score": 84,
        "category": "Aviation",
        "hash": "0x43054b6bbe13fcd68eaabbd97b52416717e5671d7a0912781701a40137f1b451"
    },
    {
        "name": "Mandarin Oriental",
        "score": 84,
        "category": "Hotels",
        "hash": "0xdafa5467abe1f0e7ded55fdd1fc522cb41b1a7ca001180f62056e72877ccaa4c"
    },
    {
        "name": "La Réserve",
        "score": 84,
        "category": "Hotels",
        "hash": "0xddff608174215a0177a82d9c6c5780a43e7e17d3bda281082b006b18a9bab34b"
    },
    {
        "name": "Annabel's",
        "score": 84,
        "category": "Private Club",
        "hash": "0xc7117105919a8abc23ae697a8435d4d214ee9beef6a7494b1c304bbf8ee80d98"
    },
    {
        "name": "Gulfstream",
        "score": 83,
        "category": "Aviation",
        "hash": "0x350faba3c840e6c10ae334cfd2c14908e8231b242175bba1e479ebc35165bafd"
    },
    {
        "name": "Four Seasons",
        "score": 83,
        "category": "Hotels",
        "hash": "0x208a223ae58bd5be9232bb7aafb43073c6fd7535cff46922065282f6aab4b76f"
    },
    {
        "name": "Six Senses",
        "score": 83,
        "category": "Hotels",
        "hash": "0xb66e46ec1edde70a0791a9433a5068b3e61d6c7d0fcd1aafe076ed616cf85ea2"
    },
    {
        "name": "Ritz-Carlton",
        "score": 82,
        "category": "Hotels",
        "hash": "0xbf0a4ce20a35cf3c08cb2a47da7635eac433f4de9f704207735679c7eaf40843"
    },
    {
        "name": "Macallan",
        "score": 82,
        "category": "Spirits",
        "hash": "0x55f3ef06196220ca6a12d8158af44596a0c4e309d1caee4cb294c511e17f49d4"
    },
    {
        "name": "Wally Yachts",
        "score": 82,
        "category": "Yachting",
        "hash": "0x1ad65816a65a9241aea181bf0be5f7b29365817b6e99ba6c7ba8b65e76679337"
    },
    {
        "name": "The Dorchester",
        "score": 82,
        "category": "Hotels",
        "hash": "0x915e44af851d340f1f81b293281f501f14c63265eaedc2bdddec6aa80e96ace1"
    },
    {
        "name": "Saint Laurent",
        "score": 81,
        "category": "Fashion",
        "hash": "0xfbdfd493c2d6242b845d91ddecc8a0800a4b42e71cae05797cea19d31b9c792b"
    },
    {
        "name": "Baccarat",
        "score": 81,
        "category": "Lifestyle",
        "hash": "0x824e1ffc6e05df411ca607affc6fdad6775b4e0d21ab7a5973c4c4a1036fd0cf"
    },
    {
        "name": "One&Only",
        "score": 81,
        "category": "Hotels",
        "hash": "0xe47b16a7cbf6783b52277b07c5d44abf15962c7a08f8121cb3dc535388c319a7"
    },
    {
        "name": "Prada",
        "score": 80,
        "category": "Fashion",
        "hash": "0x8ac804e0c928c6fbdf21ca5802581f351f96474f4a83d861cb2a3205b1255dc6"
    },
    {
        "name": "Gucci",
        "score": 79,
        "category": "Fashion",
        "hash": "0x0ead42957397bab2b440b1335305e2d51793e49fb21b9c72467868b68a1afeca"
    },
    {
        "name": "Lalique",
        "score": 79,
        "category": "Lifestyle",
        "hash": "0x5ebcea1ee26f74d7923685f6af931fb0e7816c2d139f8aaef811e00b1d437ced"
    },
    {
        "name": "St. Regis",
        "score": 79,
        "category": "Hotels",
        "hash": "0x185fbf8154b8784c4a9eaeae9e4e0d13e83d189ab0fed5f1871780ee114309fb"
    },
    {
        "name": "Balenciaga",
        "score": 78,
        "category": "Fashion",
        "hash": "0x109037e1ad1470b91c300e598cbf74d488b09cc71f756c03a272759e65512728"
    },
    {
        "name": "Rimowa",
        "score": 78,
        "category": "Travel",
        "hash": "0xfdeb347a920ca3892c09a236e7b73904dc775ab2c9a513ba6779c901ca56b2c0"
    },
    {
        "name": "Benetti",
        "score": 78,
        "category": "Yachting",
        "hash": "0x44221aaa5a7f5a5742e67b4c93063d645caa393880d623e074e872573b938130"
    },
    {
        "name": "Embraer",
        "score": 78,
        "category": "Aviation",
        "hash": "0xa8c4d97b41fd2064be1c479e48284507dfc3929e8a697db5d80faee4c6784ed8"
    },
    {
        "name": "Valentino",
        "score": 77,
        "category": "Fashion",
        "hash": "0xf5954d2df187d89943554a6afa8384e5d0e2c914ea24649c311ec4eade3d9a43"
    },
    {
        "name": "Lamborghini",
        "score": 77,
        "category": "Automotive",
        "hash": "0x7cdd7cc2375e49f6ebff929df490f51c1fa5fa626838f10e785989ed6394c540"
    },
    {
        "name": "Christofle",
        "score": 77,
        "category": "Lifestyle",
        "hash": "0x6a343ef5b4ee168c5a4336e218227468f478da37bb186b713678ce126123e3a9"
    },
    {
        "name": "Cipriani",
        "score": 77,
        "category": "Dining",
        "hash": "0x1e7935b47dac7d2459da32005a5c2a5e81d89ff49fdf2f934e37eb90cd097f6e"
    },
    {
        "name": "Aston Martin",
        "score": 76,
        "category": "Automotive",
        "hash": "0x526b48c58d34b0ff6c341d6281608a1c6c2d027a29ca1e5c97f16fdbedb5c4d5"
    },
    {
        "name": "Hennessy",
        "score": 76,
        "category": "Spirits",
        "hash": "0xd2a39010c3166f30d9185f125b9b1709c8b178d6ed1f4c32eabf65972265f3ed"
    },
    {
        "name": "Bvlgari Hotels",
        "score": 76,
        "category": "Hotels",
        "hash": "0xa049c80666f72ccca74bf948e0a740a677897a0349d35aec73d3d32a8a73596c"
    },
    {
        "name": "Bulgari",
        "score": 75,
        "category": "Jewelry",
        "hash": "0x649f761e790109538181af9ca034cae022b0945e5de5230bfa5cc70b1a4c7c0a"
    },
    {
        "name": "Tiffany & Co.",
        "score": 74,
        "category": "Jewelry",
        "hash": "0x05d57f5ef62c19db2530948c45ba729111430a78093325df5ef54032164f1a92"
    },
    {
        "name": "Moncler",
        "score": 74,
        "category": "Fashion",
        "hash": "0x354c1b3cc21d645d5cb511a4da83b0027b752dc8209875b449e83696e766d7f1"
    },
    {
        "name": "Taschen",
        "score": 74,
        "category": "Publishing",
        "hash": "0x6e5ff882a90e6599badaa058f216e2e3523784d467efecb2588ccbdfc3b7f65c"
    },
    {
        "name": "Hublot",
        "score": 73,
        "category": "Watches",
        "hash": "0x196ddcbef00baf3806fd3594b378b5f83b779d797e2a212ef1611d462d93db28"
    },
    {
        "name": "Bang & Olufsen",
        "score": 72,
        "category": "Audio",
        "hash": "0x6d6b515335790b4d9249bbf1d15250ca454d126944a74e54d31f27d33c2660d9"
    },
    {
        "name": "Cessna",
        "score": 72,
        "category": "Aviation",
        "hash": "0x99f49c2413ccb092f8adcb298efb433698dc6fb2611c0a79af464a98943a3eb6"
    },
    {
        "name": "Azimut",
        "score": 71,
        "category": "Yachting",
        "hash": "0x5e02cb4267d9213a7d66d54ee4d6f6ccbf78a79e3212a75d2a0f7cc3ebb2167d"
    },
    {
        "name": "Fendi",
        "score": 70,
        "category": "Fashion",
        "hash": "0x0c73a1a80cfcf51df9f5f15a571bcf4619894fa1c93512aea924f200c2554365"
    },
    {
        "name": "Post Oak Hotel",
        "score": 70,
        "category": "Hotels",
        "hash": "0x3fa18376bdbecbb28746b22f4c6a5b02a6bc41a43bda2d9d06c9ee3f12a235f7"
    },
    {
        "name": "Givenchy",
        "score": 69,
        "category": "Fashion",
        "hash": "0xd0eb2b7c49b028835b70626d5d05556fa3415300ebd16a16208f6cf3d53f9825"
    },
    {
        "name": "Celine",
        "score": 68,
        "category": "Fashion",
        "hash": "0x77933296e73fe8257bb071ebd37135c140c8ed5d99443b9b429a4f0a19481c19"
    },
    {
        "name": "Wedgwood",
        "score": 68,
        "category": "Lifestyle",
        "hash": "0xe6e34c41ced0f23e3707dda7d6201c8696f9e9231b6cc3ec5be28c19de4985be"
    },
    {
        "name": "Nobu Hotels",
        "score": 68,
        "category": "Hotels",
        "hash": "0x4812861620a133bbb08c5da92474ac474afd0238d8b027db15ffd4a64acfb92f"
    },
    {
        "name": "Loewe",
        "score": 67,
        "category": "Fashion",
        "hash": "0xfcc8b7f1245b4ab7964771933275ca64a7a421ef14edd4625ed56052d5ae74b7"
    },
    {
        "name": "Bottega Veneta",
        "score": 66,
        "category": "Fashion",
        "hash": "0x578db149ebfdd9befd54b8c62dafe164fda9a10cf2e29b4f7793c84c1114d8f9"
    },
    {
        "name": "Tom Ford",
        "score": 65,
        "category": "Fashion",
        "hash": "0x638669b341914541c87519ed3b0255e38d57b9ca19643c1ca5268650210e8560"
    },
    {
        "name": "Burberry",
        "score": 65,
        "category": "Fashion",
        "hash": "0x0d42144847a527d3a4cc86ad95303fbdee27f1c8db7a14e845b2de8c48f31851"
    },
    {
        "name": "IWC",
        "score": 64,
        "category": "Watches",
        "hash": "0x4a73f672f9f455eb5b0a22bff3de159005fbc7f94a9dc37e7d862d9c94526392"
    },
    {
        "name": "Richard Mille",
        "score": 63,
        "category": "Watches",
        "hash": "0xd049acbe740e04e70c6fb770391918088c48d57578fc8583b45e4dda366fad9a"
    },
    {
        "name": "Chopard",
        "score": 62,
        "category": "Jewelry",
        "hash": "0x2892f3cc39cb29a5f052c2ead8dcb06af69480b43cf9a85b03c5a74c56ab1e4b"
    },
    {
        "name": "Soho House",
        "score": 61,
        "category": "Private Club",
        "hash": "0x1061091a0e3028e4cd3eca58a2faeca22187d454d1f8f42cb678f19eada0f502"
    },
    {
        "name": "Pagani",
        "score": 59,
        "category": "Automotive",
        "hash": "0x81b732a47df3e3a86704adc068caee15b3b9384bf3c867e78afb6f12d837e320"
    },
    {
        "name": "Graff",
        "score": 54,
        "category": "Jewelry",
        "hash": "0x019528047036e148e8832d38364ae42e4f22955e6fe5f8c900c39360cbcc5404"
    },
    {
        "name": "Maserati",
        "score": 51,
        "category": "Automotive",
        "hash": "0xca9e7cccb8b9fde54e99ba418c3df1b03f0a7f29f4b5484d044b03689df21b5e"
    },
    {
        "name": "Zilli",
        "score": 46,
        "category": "Fashion",
        "hash": "0x145e70fe727a88a95754d621571c45b66d995b33416fa81500c10e0f75cb17da"
    },
    {
        "name": "Stefano Ricci",
        "score": 45,
        "category": "Fashion",
        "hash": "0x4620f17ebe28c65b827c5f9255be3aa44034cb45a1e7916a884beaf2e78c2c02"
    },
    {
        "name": "Goyard",
        "score": 42,
        "category": "Leather Goods",
        "hash": "0x6d9296b2447f94bb7f441dc1ec27bb737cad765a2dc3e22d21ce8b70146fd3a6"
    },
    {
        "name": "Philipp Plein",
        "score": 38,
        "category": "Fashion",
        "hash": "0x56882dc9475d4a305e14ed37c56b5680e463b922d053ac37b1ffcee14c5666ec"
    }
];