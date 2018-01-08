## Testing

Run unit and funtional tests with:
`npm test`

## Travis CI

Note that running the functional tests in TravisCI require
credentials for the Conversation Service and a Conversation
workspace ID.
[Travis Environment Variables](https://docs.travis-ci.com/user/environment-variables/#Defining-encrypted-variables-in-.travis.yml)

With travis installed via

 `gem install travis`

 encrypt with:

`travis encrypt VISUAL_RECOGNITION_API_KEY=<your_API_key>`

The output will look like:
```
Please add the following to your .travis.yml file:

  secure: "r7R+dsmsMYOwPSwq32EG2+qtw49/2nIiEvU1pj1GtATfGnDkt4YjdS6LWKZ2KpE4F3hjx9QqQsJVnZS2O/1EZmZWeS6Gjv3g/uTxvuz8djfrBGkT65tL9pILT1mviQxt3Uf4W/mZxAveVHq6aYST7NI716+1eTBEUXCHR2TEA0zbsaPvbMprRz2Kz8ixLc0eT9umXjlvK+EUP6H+wtlKUltN2k1PYd<snip_for_brevity>"
```

Put this in your .travis.yml file like this:
```
env:
  global:
    - secure: <some_string_of_encrypted_data>
```

> Note: You can add directly to the .travis.yml file with the following, but beware that it can add artifacts to the file that will render it non-working: `travis encrypt VISUAL_RECOGNITION_API_KEY=<your_API_key> --add .travis.yml`
