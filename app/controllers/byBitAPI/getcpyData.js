const { handleError } = require("../../middleware/utils");
const subkey = require('../../models/copytrade');


const getcpyData = async (req, res) => {
  try {
    const user = req.user;
    const userKeys = await subkey.findOne({ user_id: user._id });

    if (userKeys) {

      function encryptCaesar(plaintext, shift) {
        return plaintext
          .split("")
          .map(char => {
            if (char.match(/[a-z]/i)) {
              let code = char.charCodeAt(0);
              let start = char.toLowerCase() === char ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
              return String.fromCharCode((code - start + shift) % 26 + start);
            } else if (char.match(/[0-9]/)) {
              let code = char.charCodeAt(0);
              let start = '0'.charCodeAt(0);
              return String.fromCharCode((code - start + shift) % 10 + start);
            }
            return char;
          })
          .join("");
      }
      // To decrypy the encrypted data
    //   function decryptCaesar(ciphertext, shift) {
    //     return ciphertext
    //       .split("")
    //       .map(char => {
    //         if (char.match(/[a-z]/i)) {
    //           let code = char.charCodeAt(0);
    //           let start = char.toLowerCase() === char ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
    //           return String.fromCharCode((code - start - shift + 26) % 26 + start);
    //         } else if (char.match(/[0-9]/)) {
    //           let code = char.charCodeAt(0);
    //           let start = '0'.charCodeAt(0);
    //           return String.fromCharCode((code - start - shift + 10) % 10 + start);
    //         }
    //         return char;
    //       })
    //       .join("");
    //   }   

      const encryptedApiKey = encryptCaesar(userKeys.apikey, 3);
      const encryptedSecretKey = encryptCaesar(userKeys.secretkey, 3);


    //   const decryptedApiKey = decryptCaesar(encryptedSecretKey, 3);

    //   console.log(encryptedApiKey, 'encryptedApiKey');  
    //   console.log(userKeys.apikey, 'originalApiKey');   
    //   console.log(decryptedApiKey, 'decryptedApiKey');
    //   console.log(decryptedApiKey.slice(0,-16), 'decryptedApiKeyWithousalt');

      const data = {
        one : encryptedApiKey,
        two : encryptedSecretKey
      };


      res.status(200).json({
        success: true,
        result: data,
        message: 'Data Found Successfully'
      });
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: 'User Not Found'
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getcpyData };
