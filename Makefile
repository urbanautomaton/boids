WEBPACK := ./node_modules/.bin/webpack
WEBPACK_CONFIG := webpack.config.js

SRC := ./app
OUT := ./dist

SRC_FILES := $(wildcard $(SRC)/*.js)

APP := $(SRC)/main.js
BUNDLE := $(OUT)/bundle.js
GL_APP := $(SRC)/gl.js
GL_BUNDLE := $(OUT)/gl_bundle.js

.PHONY: all clean

default: all

all: $(GL_BUNDLE)

$(BUNDLE): $(SRC_FILES)
	$(WEBPACK) $(APP) $(BUNDLE)

$(GL_BUNDLE): $(SRC_FILES)
	$(WEBPACK) $(GL_APP) $(GL_BUNDLE)

clean:
	rm -rf $(OUT)
