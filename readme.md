# Shrouded API

## Configuration

See .example.env for configurable parameters.

```sh
npm run dev
```

## Understanding the program

An E2E test has been created at `test/e2e.ts` to facilitate the understanding of how this backend should be used. The scenario is explained in the file comment.

```txt
shrouded:info:E2E-TEST [Setup] Generating circuit +0ms
shrouded:info:E2E-TEST [Admin] Creating new identity group +2s
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST   name: 'TESTING-GROUP-5ccc53e7-aa37-4f54-9335-941635a2d6b4'
shrouded:debug:E2E-TEST } +0ms
shrouded:info:E2E-TEST [Admin] Identity group created: f1f9b9cf-8fd0-4d5b-9d01-204233daa98f +61ms
shrouded:info:E2E-TEST [Beneficiary 1] Generating identity +0ms
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   keypair: {
shrouded:debug:E2E-TEST     pubKey: [
shrouded:debug:E2E-TEST       14407614311200499839578837500851771610098518822576987098739216557205966160068n,
shrouded:debug:E2E-TEST       12405095474148962665141997301515687766069743771498686268274601174460370476234n
shrouded:debug:E2E-TEST     ],
shrouded:debug:E2E-TEST     privKey: <Buffer 64 a1 04 d4 9e 77 88 ca e9 58 94 7a e9 9c 42 ed 8f bc a2 5e 01 65 2c 6d 17 da 03 b3 c2 eb 24 71>
shrouded:debug:E2E-TEST   },
shrouded:debug:E2E-TEST   identityNullifier: 188853213167194630888914206099642162209461987674682079768846100689524158926n,
shrouded:debug:E2E-TEST   identityTrapdoor: 209163816875340288802104240511935087440774580119208381639981492932889222843n
shrouded:debug:E2E-TEST } +113ms
shrouded:info:E2E-TEST [Beneficiary 1] Generating identity commitment +110ms
shrouded:info:E2E-TEST [Beneficiary 1] Identity commitment: 5309918541969448733395034726813899689955608803522360103143102267847842539655 +603ms
shrouded:info:E2E-TEST [Beneficiary 2] Generating identity +0ms
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   keypair: {
shrouded:debug:E2E-TEST     pubKey: [
shrouded:debug:E2E-TEST       13186149189783736204533194915124492635956712853987012243080441905037265825281n,
shrouded:debug:E2E-TEST       19158598879623627749993662672372263276983304660251353814711921445654036806994n
shrouded:debug:E2E-TEST     ],
shrouded:debug:E2E-TEST     privKey: <Buffer 4b 05 c5 d5 91 97 3b 37 c8 93 91 58 ca ff 4e c1 37 aa 63 7a 5b 76 5d 3d aa 8c 71 c5 d6 a4 e9 31>
shrouded:debug:E2E-TEST   },
shrouded:debug:E2E-TEST   identityNullifier: 20708385848256113170249050395861627229921804917622663993868409365902994295n,
shrouded:debug:E2E-TEST   identityTrapdoor: 163636187515378546921152351198733932290934772079826370875785395755571464343n
shrouded:debug:E2E-TEST } +714ms
shrouded:info:E2E-TEST [Beneficiary 2] Generating identity commitment +111ms
shrouded:info:E2E-TEST [Beneficiary 2] Identity commitment: 15753359531653973128177436672861128347511577047510240457089589044961002968076 +281ms
shrouded:info:E2E-TEST [Admin] Registering beneficiary 1 identity commitment +0ms
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST   identityCommitment: '5309918541969448733395034726813899689955608803522360103143102267847842539655'
shrouded:debug:E2E-TEST } +332ms
shrouded:info:E2E-TEST [Admin] Registering beneficiary 2 identity commitment +50ms
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST   identityCommitment: '15753359531653973128177436672861128347511577047510240457089589044961002968076'
shrouded:debug:E2E-TEST } +53ms
shrouded:info:E2E-TEST [Program Owner] Using external nullifier: FOOD_COLLECTION-20210115 +55ms
shrouded:debug:E2E-TEST BigNumber {
shrouded:debug:E2E-TEST   _hex: '0x464f4f445f434f4c4c454354494f4e2d3230323130313135',
shrouded:debug:E2E-TEST   _isBigNumber: true
shrouded:debug:E2E-TEST } +2ms
shrouded:info:E2E-TEST [Beneficiary 1] Generating claim for given program +1ms
shrouded:info:E2E-TEST [Beneficiary 1] Fetching identity commitment list +0ms
shrouded:debug:E2E-TEST [
shrouded:debug:E2E-TEST   {
shrouded:debug:E2E-TEST     identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST     identityCommitment: '15753359531653973128177436672861128347511577047510240457089589044961002968076'
shrouded:debug:E2E-TEST   },
shrouded:debug:E2E-TEST   {
shrouded:debug:E2E-TEST     identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST     identityCommitment: '5309918541969448733395034726813899689955608803522360103143102267847842539655'
shrouded:debug:E2E-TEST   }
shrouded:debug:E2E-TEST ] +41ms
shrouded:info:E2E-TEST [Beneficiary 1] Building local identity commitment tree +40ms
shrouded:debug:E2E-TEST [
shrouded:debug:E2E-TEST   BigNumber {
shrouded:debug:E2E-TEST     _hex: '0x22d415e4b021937a3bb9b85a543b43a40b105b1df3b07611898dc80de6b4d40c',
shrouded:debug:E2E-TEST     _isBigNumber: true
shrouded:debug:E2E-TEST   },
shrouded:debug:E2E-TEST   BigNumber {
shrouded:debug:E2E-TEST     _hex: '0x0bbd4eb127bcabbecd6097f0238cd917064c37738146b2fd5fea701a21d52887',
shrouded:debug:E2E-TEST     _isBigNumber: true
shrouded:debug:E2E-TEST   }
shrouded:debug:E2E-TEST ] +1ms
shrouded:info:E2E-TEST [Beneficiary 1] Generating witness +2ms
shrouded:info:E2E-TEST [Beneficiary 1] Generating proof +5s
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   pi_a: [
shrouded:debug:E2E-TEST     881913873837953430104711549943955784239992049707747113025913540387281541532n,
shrouded:debug:E2E-TEST     4462197506235014131734745912357898685734207017876055315454792825419394968679n,
shrouded:debug:E2E-TEST     1n
shrouded:debug:E2E-TEST   ],
shrouded:debug:E2E-TEST   pi_b: [
shrouded:debug:E2E-TEST     [
shrouded:debug:E2E-TEST       8931121846011622530661469497022573410989807757220154217466232688763329728654n,
shrouded:debug:E2E-TEST       3230980496782425382109078016547721886971569841595158257998614792987553288863n
shrouded:debug:E2E-TEST     ],
shrouded:debug:E2E-TEST     [
shrouded:debug:E2E-TEST       17183630602151890216735336335242988103945572954815858456565848789696559693058n,
shrouded:debug:E2E-TEST       13131044771356737819877206133498569770618004608440538215705418950922853593590n
shrouded:debug:E2E-TEST     ],
shrouded:debug:E2E-TEST     [ 1n, 0n ]
shrouded:debug:E2E-TEST   ],
shrouded:debug:E2E-TEST   pi_c: [
shrouded:debug:E2E-TEST     18779977373339887653957421322432684247792792594685901930588337267336138991060n,
shrouded:debug:E2E-TEST     12188913052044968321263912756759311797606928985512536516078518706957988202150n,
shrouded:debug:E2E-TEST     1n
shrouded:debug:E2E-TEST   ]
shrouded:debug:E2E-TEST } +19s
shrouded:info:E2E-TEST [Beneficiary 1] Generating public signal +15s
shrouded:debug:E2E-TEST [
shrouded:debug:E2E-TEST   6564174285915950489434699202346461205545906611455724975719462890454120247164n,
shrouded:debug:E2E-TEST   1531687943065428729195210423643599544760002075387111325991365919806491187465n,
shrouded:debug:E2E-TEST   324435173924234642046472247965735262526828400981893803033103980410751275176n,
shrouded:debug:E2E-TEST   1723991359837900747271504961393156169423940698095754490165n
shrouded:debug:E2E-TEST ] +0ms
shrouded:info:E2E-TEST [Beneficiary 1] Constructing claim payload +1ms
shrouded:debug:E2E-TEST {
shrouded:debug:E2E-TEST   proof: {
shrouded:debug:E2E-TEST     snarkProof: { pi_a: [Array], pi_b: [Array], pi_c: [Array] },
shrouded:debug:E2E-TEST     merkleRoot: '6564174285915950489434699202346461205545906611455724975719462890454120247164'
shrouded:debug:E2E-TEST   },
shrouded:debug:E2E-TEST   nullifier: '1531687943065428729195210423643599544760002075387111325991365919806491187465',
shrouded:debug:E2E-TEST   identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST   externalNullifier: 'FOOD_COLLECTION-20210115',
shrouded:debug:E2E-TEST   message: 'ABC PTE LTD'
shrouded:debug:E2E-TEST } +1ms
shrouded:info:E2E-TEST [Beneficiary 1] Submitting Claim +0ms
shrouded:info:E2E-TEST { success: true } +2s
shrouded:info:E2E-TEST [Program Owner] Checking Claims +1ms
shrouded:debug:E2E-TEST [
shrouded:debug:E2E-TEST   {
shrouded:debug:E2E-TEST     identityGroup: 'f1f9b9cf-8fd0-4d5b-9d01-204233daa98f',
shrouded:debug:E2E-TEST     externalNullifier: 'FOOD_COLLECTION-20210115',
shrouded:debug:E2E-TEST     nullifier: '1531687943065428729195210423643599544760002075387111325991365919806491187465',
shrouded:debug:E2E-TEST     message: 'ABC PTE LTD',
shrouded:debug:E2E-TEST     proof: {
shrouded:debug:E2E-TEST       merkleRoot: '6564174285915950489434699202346461205545906611455724975719462890454120247164',
shrouded:debug:E2E-TEST       snarkProof: [Object]
shrouded:debug:E2E-TEST     }
shrouded:debug:E2E-TEST   }
shrouded:debug:E2E-TEST ] +2s
shrouded:info:E2E-TEST [Public Info] +39ms
shrouded:info:E2E-TEST Identity Group: f1f9b9cf-8fd0-4d5b-9d01-204233daa98f +0ms
shrouded:info:E2E-TEST Identity Group Merkle Root: 6564174285915950489434699202346461205545906611455724975719462890454120247164 +0ms
shrouded:info:E2E-TEST External Nullifier: FOOD_COLLECTION-20210115 +0ms
shrouded:info:E2E-TEST Message: ABC PTE LTD +0ms
shrouded:info:E2E-TEST [Private Info] +0ms
shrouded:info:E2E-TEST Beneficiary 1 Private Key: 64a104d49e7788cae958947ae99c42ed8fbca25e01652c6d17da03b3c2eb2471 +0ms
shrouded:info:E2E-TEST Beneficiary 1 Public Key: 1440761431120049983957883750085177161009851882257698709873921655720596616006812405095474148962665141997301515687766069743771498686268274601174460370476234 +0ms
shrouded:info:E2E-TEST Beneficiary 1 Identity Nullifier: 188853213167194630888914206099642162209461987674682079768846100689524158926 +0ms
shrouded:info:E2E-TEST Beneficiary 1 Identity Trapdoor: 209163816875340288802104240511935087440774580119208381639981492932889222843 +0ms
```

## Notes

### Application usage pattern

1. Identity group admin creates a new identity group
1. (Offline) Beneficiary communicate identity commitment to identity group admin
1. Identity group admin insert identity commitment(s) into group
1. Beneficiary (whose identity commitment is inserted) fetch entire identity commitment list (mvp, use merkle path to save space)
1. (Offline) Beneficiary generates claim proof
1. Beneficiary submits claim proof
1. Anyone to read the claim ledger

### TODO

- List & filter claim endpoint

### Gotchas

- Retrieval of identity commitments is ordered by sort key instead of time added
