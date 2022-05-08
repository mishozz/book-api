import jwt from 'jsonwebtoken'

class AuthClient {
    verifyToken = (req, res, next) => {
        let token;
        if(req.cookies.token) {
          token = req.cookies.token; 
        }
        if (!token) {
          return res.status(403).send({
            message: "No token provided!"
          });
        }
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
          if (err) {
            return res.status(401).send({
              message: "Unauthorized!"
            });
          }
          req.email = decoded.email;
          req.role = decoded.role;
          next();
        });
      };

      isUserOrAdmin = (req, res, next) => {
        if (req.role != 'USER' && req.role != 'ADMIN') {
            return res.status(401).send({
                message: "Unauthorized!"
              }); 
        }
        next();
      };

      isCommentOwner = (req, res, next) => {
        if(req.email != req.body.from) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        next();
      }

}

export default AuthClient;
