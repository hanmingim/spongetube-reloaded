import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "spongetubee/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "spongetubee/videos",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "SpongeTube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.siteTitle = "Home";
  next();
};
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn && req.session.user) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "No authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars", limits: {
    filesize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({//Video
  dest: "uploads/videos", limits: {
    filesize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});