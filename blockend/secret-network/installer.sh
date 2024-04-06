
sudo apt-get install git make
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup target add wasm32-unknown-unknown
cargo install cargo-generate --features vendored-openssl
make build
cd node
npm install
node index.js
node create_keys.js
node get_keys.js