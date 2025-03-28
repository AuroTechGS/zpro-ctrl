mkdir -p ~/libjpeg-turbo-test && cd ~/libjpeg-turbo-test

wget https://downloads.sourceforge.net/libjpeg-turbo/libjpeg-turbo-2.1.5.1.tar.gz
tar -xf libjpeg-turbo-2.1.5.1.tar.gz
cd libjpeg-turbo-2.1.5.1

sudo apt update
sudo apt install -y cmake nasm build-essential

mkdir build && cd build
cmake -DCMAKE_INSTALL_PREFIX=$HOME/libjpeg-install ..
make -j$(nproc)
make install
