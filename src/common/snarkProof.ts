/* eslint-disable @typescript-eslint/camelcase,no-undef */
import { Record, String, Tuple, Static } from "runtypes";
import { SnarkProof } from "../types";

export const SnarkProofRT = Record({
  pi_a: Tuple(String, String, String),
  pi_b: Tuple(Tuple(String, String), Tuple(String, String), Tuple(String, String)),
  pi_c: Tuple(String, String, String)
});

export type SnarkProofStr = Static<typeof SnarkProofRT>;

export const bigIntSnarkProof = (input: SnarkProofStr): SnarkProof => {
  const { pi_a, pi_b, pi_c } = input;
  return {
    pi_a: [BigInt(pi_a[0]), BigInt(pi_a[1]), BigInt(pi_a[2])],
    pi_b: [
      [BigInt(pi_b[0][0]), BigInt(pi_b[0][1])],
      [BigInt(pi_b[1][0]), BigInt(pi_b[1][1])],
      [BigInt(pi_b[2][0]), BigInt(pi_b[2][1])]
    ],
    pi_c: [BigInt(pi_c[0]), BigInt(pi_c[1]), BigInt(pi_c[2])]
  };
};

export const snarkProofBigInt = (input: SnarkProof): SnarkProofStr => {
  const { pi_a, pi_b, pi_c } = input;
  return {
    pi_a: [pi_a[0].toString(), pi_a[1].toString(), pi_a[2].toString()],
    pi_b: [
      [pi_b[0][0].toString(), pi_b[0][1].toString()],
      [pi_b[1][0].toString(), pi_b[1][1].toString()],
      [pi_b[2][0].toString(), pi_b[2][1].toString()]
    ],
    pi_c: [pi_c[0].toString(), pi_c[1].toString(), pi_c[2].toString()]
  };
};
