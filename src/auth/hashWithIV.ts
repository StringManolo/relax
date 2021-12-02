import crypto from "crypto";

const hashWithIV = async (password: string, iv: string) => {
  return new Promise( (resolve, reject) => {
    crypto.scrypt(password, iv, 64, (error, derivedKey) => {
      if (error) {
	reject(error);
      }
      
      resolve(`${iv}:${derivedKey.toString("hex")}`);
    });
  });
}

export default hashWithIV;
