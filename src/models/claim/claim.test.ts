import { transformEntryToClaim, transformClaimToEntry } from "./claim";

describe("transformEntryToClaim", () => {
  it("should transform correctly", () => {
    const entry = {
      PK: "IDENTITY_GROUP#idg1",
      SK: "#EXTERNAL_NULLIFIER#ext_null_1#null_1",
      data: {
        message: "test message",
        proof: {
          merkleRoot: "",
          snarkProof: {
            pi_a: ["11", "11", "11"],
            pi_b: [
              ["11", "11"],
              ["11", "11"],
              ["11", "11"]
            ],
            pi_c: ["11", "11", "11"]
          }
        }
      }
    };
    expect(transformEntryToClaim(entry)).toMatchInlineSnapshot(`
      Object {
        "externalNullifier": "ext_null_1",
        "identityGroup": "idg1",
        "message": "test message",
        "nullifier": "null_1",
        "proof": Object {
          "merkleRoot": "",
          "snarkProof": Object {
            "pi_a": Array [
              "11",
              "11",
              "11",
            ],
            "pi_b": Array [
              Array [
                "11",
                "11",
              ],
              Array [
                "11",
                "11",
              ],
              Array [
                "11",
                "11",
              ],
            ],
            "pi_c": Array [
              "11",
              "11",
              "11",
            ],
          },
        },
      }
    `);
  });
});

describe("transformClaimToEntry", () => {
  it("should transform correctly", () => {
    const idc = {
      externalNullifier: "ext_null_1",
      identityGroup: "idg1",
      message: "hello world",
      nullifier: "null_1",
      proof: {
        merkleRoot: "",
        snarkProof: {
          pi_a: ["11", "11", "11"],
          pi_b: [
            ["11", "11"],
            ["11", "11"],
            ["11", "11"]
          ],
          pi_c: ["11", "11", "11"]
        }
      }
    };
    expect(transformClaimToEntry(idc)).toMatchInlineSnapshot(`
      Object {
        "PK": "IDENTITY_GROUP#idg1",
        "SK": "#EXTERNAL_NULLIFIER#ext_null_1#null_1",
        "data": Object {
          "message": "hello world",
          "proof": Object {
            "merkleRoot": "",
            "snarkProof": Object {
              "pi_a": Array [
                "11",
                "11",
                "11",
              ],
              "pi_b": Array [
                Array [
                  "11",
                  "11",
                ],
                Array [
                  "11",
                  "11",
                ],
                Array [
                  "11",
                  "11",
                ],
              ],
              "pi_c": Array [
                "11",
                "11",
                "11",
              ],
            },
          },
        },
      }
    `);
  });
});
