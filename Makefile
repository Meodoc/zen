# Makefile

ZEN_PROFILE_DIR = /home/lukas/.zen/qe8e4imy.Default (release)-1
SCRIPTS = \
	zen-urlbar-vim-nav.uc.mjs

install:
	@echo "Installing scripts to $(ZEN_PROFILE_DIR) ..."
	@for script in $(SCRIPTS); do \
		echo "  -> Installing $$script"; \
		mkdir -p "$(ZEN_PROFILE_DIR)/chrome/JS"; \
		cp "$$script" "$(ZEN_PROFILE_DIR)/chrome/JS/$$script"; \
	done
	@echo "Install finished!"
