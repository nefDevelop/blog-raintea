#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(realpath "${SCRIPT_DIR}/../astro-ri")"
BLOG_DIR="${SCRIPT_DIR}"

DRY_RUN=false
VERBOSE=false

usage() {
	cat <<EOF
Uso: ./sync-theme.sh [opciones]

Sincroniza el tema astro-ri en blog-raintea.
Copia todos los archivos del tema excepto los que son específicos del blog.

Opciones:
  --dry-run    Muestra qué archivos se copiarían sin hacer cambios
  --verbose    Muestra todos los archivos copiados
  --help       Muestra esta ayuda

Archivos que NO se sobrescriben:
  - src/consts.ts         (configuración del blog)
  - src/content/          (contenido del blog)
  - package.json          (configuración del proyecto)
  - package-lock.json     
  - sync-theme.sh         (este script)
  - .git/                 (historial git)

Ejemplo:
  ./sync-theme.sh          # sincroniza el tema
  ./sync-theme.sh --dry-run  # previsualiza antes de sincronizar
EOF
	exit 0
}

while [[ $# -gt 0 ]]; do
	case "$1" in
		--dry-run) DRY_RUN=true; shift ;;
		--verbose) VERBOSE=true; shift ;;
		--help) usage ;;
		*) echo "Opción desconocida: $1"; usage ;;
	esac
done

if [[ ! -d "$THEME_DIR" ]]; then
	echo "ERROR: No se encuentra el directorio del tema en: $THEME_DIR"
	echo "Asegúrate de que astro-ri esté en ../astro-ri"
	exit 1
fi

if [[ ! -d "$BLOG_DIR" ]]; then
	echo "ERROR: No se encuentra el directorio del blog"
	exit 1
fi

RSYNC_OPTS="-av --delete"
if [[ "$DRY_RUN" == true ]]; then
	RSYNC_OPTS="${RSYNC_OPTS} --dry-run"
fi
if [[ "$VERBOSE" != true ]]; then
	RSYNC_OPTS="${RSYNC_OPTS} --quiet"
fi

EXCLUDES=(
	"--exclude=node_modules/"
	"--exclude=.git/"
	"--exclude=dist/"
	"--exclude=.astro/"
	"--exclude=package-lock.json"
	"--exclude=src/content/"
	"--exclude=src/consts.ts"
	"--exclude=package.json"
	"--exclude=sync-theme.sh"
)

DIRS_TO_SYNC=(
	"src/layouts"
	"src/components"
	"src/config"
	"src/plugins"
	"src/styles"
	"src/assets"
	"src/i18n"
	"src/pages"
	"public"
)

FILES_TO_SYNC=(
	"src/content.config.ts"
	"astro.config.mjs"
	"tsconfig.json"
	".gitignore"
)

echo "=== Sincronizando tema desde: astro-ri ==="
echo "Origen:  ${THEME_DIR}"
echo "Destino: ${BLOG_DIR}"
if [[ "$DRY_RUN" == true ]]; then
	echo "Modo:    DRY RUN (no se hacen cambios)"
fi
echo ""

# Sync directories
for dir in "${DIRS_TO_SYNC[@]}"; do
	src="${THEME_DIR}/${dir}/"
	dst="${BLOG_DIR}/${dir}/"
	if [[ -d "$src" ]]; then
		mkdir -p "$dst"
		rsync $RSYNC_OPTS "${EXCLUDES[@]}" "$src" "$dst"
	fi
done

# Sync individual files
for file in "${FILES_TO_SYNC[@]}"; do
	src="${THEME_DIR}/${file}"
	dst="${BLOG_DIR}/${file}"
	if [[ -f "$src" ]]; then
		mkdir -p "$(dirname "$dst")"
		if [[ "$DRY_RUN" == true ]]; then
			if [[ "$src" -nt "$dst" ]] || [[ ! -f "$dst" ]]; then
				echo "${file} (se actualizaría)"
			fi
		else
			cp "$src" "$dst"
			[[ "$VERBOSE" == true ]] && echo "${file} actualizado"
		fi
	fi
done

echo ""
if [[ "$DRY_RUN" == true ]]; then
	echo "=== Dry run completado. Usa ./sync-theme.sh para aplicar cambios. ==="
else
	echo "=== Sincronización completada ==="
	echo "Recuerda: si cambió astro.config.mjs, revisa que las dependencias en"
	echo "package.json estén actualizadas."
fi
