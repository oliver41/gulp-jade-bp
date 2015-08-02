### Create a jadebp.sh file in the folder you want to install the boilerplate
### go to this folder in Terminal: sh jadebp.sh name
### Source: 'op 2021 jade bp orig'


```
File: jadebp.sh

args=("$@")

# clone repo
git clone https://github.com/oliver41/gulp-jade-bp.git ${args[0]}

cd ${args[0]}

# remove git repo
rm -rf .git

# init repo
git init

#npm install
npm install

#bower install oder gulp bower
#bower install

```
