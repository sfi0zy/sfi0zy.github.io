# Personal website

Hi! I'm Ivan Bogachev and this is the repository for my personal website - sfi0zy.github.io

# License

- The source code is distributed under the MIT license.
- The images and pdf files are distributed under the CC BY-NC 3.0 license.
- The third party fonts and icons have their own licenses.

## Development

```sh
git clone git@github.com:sfi0zy/sfi0zy.github.io.git
cd sfi0zy.github.io
bundle install
npm ci
./serve.sh
```

## Deployment

```sh
./commit-and-deploy.sh "Add new post..."
```

Or, if you need to rebuild the *_site* only:

```sh
./build.sh
```

