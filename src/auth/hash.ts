import crypto from "crypto";

const hash = async (password: string) => {
  return new Promise( (resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex")
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
	reject(error);
      }
      
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export default hash;
