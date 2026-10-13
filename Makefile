# Makefile

-include config.mk

ZEN_PROFILE_DIR ?= $(error ZEN_PROFILE_DIR is not set. \
	Put it in config.mk, or run: \
	make install ZEN_PROFILE_DIR=/path/to/profile)

SCRIPTS = \
	zen-urlbar-vim-nav.uc.mjs \
	zen-split-focus-follows-mouse.uc.mjs

.PHONY: install
install:
	@test -d "$(ZEN_PROFILE_DIR)" || { \
		echo "Profile dir not found: $(ZEN_PROFILE_DIR)"; \
		exit 1; \
	}
	@echo "Installing scripts to $(ZEN_PROFILE_DIR) ..."
	@mkdir -p "$(ZEN_PROFILE_DIR)/chrome/JS"
	@for script in $(SCRIPTS); do \
		echo "  -> Installing $$script"; \
		mkdir -p "$(ZEN_PROFILE_DIR)/chrome/JS"; \
		cp "$$script" "$(ZEN_PROFILE_DIR)/chrome/JS/$$script"; \
	done
	@echo "Install finished!"

