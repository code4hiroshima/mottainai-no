module.exports = {
    "extends": "airbnb-base",
    "env": {
      "browser": true,
    },
    "plugins": ["compat", "prettier"],
    "rules": {
      "compat/compat": "error",
      "prettier/prettier": "error"
    }
};
