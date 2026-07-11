---
cms_sha: 0e9febe2b86344aabe85b3401e8bc04ad26922c0
cms_collection: blog
title: Guía de Instalación y Configuración para Fedora 44
cms_sync: true
author:
  - nefDev
categories: []
tags:
  - Linux
description: Guia de instalación de Fedora que uso cada vez que debo formatear.
published: 2026-07-10
---
tug# Guía de Instalación y Configuración para Fedora 44

## 1. Configuración Inicial del Sistema

### 1.1 RPM Fusion (Repositorios de terceros)

```bash
# Habilitar RPM Fusion (necesario para codecs y software no libre)
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Actualizar metadatos del grupo core
sudo dnf group upgrade core
```

### 1.2 Configuración Rápida de DNF

```bash
# Editar configuración para descargas más rápidas
sudo micro /etc/dnf/dnf.conf

# Añadir estas líneas:
cat << EOF | sudo tee -a /etc/dnf/dnf.conf
[main]
gpgcheck=1
installonly_limit=3
clean_requirements_on_remove=True
best=False
skip_if_unavailable=True
max_parallel_downloads=10
EOF
```

### 1.3 Flatpak (Aplicaciones sandbox)

```bash
# Habilitar Flathub (repositorio universal de flatpaks)
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

### 1.4 AppImage (Soporte para aplicaciones portables)

```bash
# Instalar fuse para soporte de AppImages
sudo dnf install -y fuse3
```

---

## 2. Multimedia y Codecs

```bash
# Reemplazar ffmpeg-free con ffmpeg completo
sudo dnf swap ffmpeg-free ffmpeg --allowerasing

# Instalar grupo multimedia completo
sudo dnf group install -y multimedia

# Instalar componentes GStreamer
sudo dnf install -y gstreamer1-plugins-{bad-*,good-*,base} gstreamer1-plugin-openh264 gstreamer1-libav --exclude=PackageKit-gstreamer-plugin

# Instalar paquetes de sonido y video
sudo dnf group install -y sound-and-video

# Soporte para DVDs cifrados (opcional)
sudo dnf install -y libdvdcss
```

### 2.1 Drivers AMD (si tienes tarjeta gráfica AMD)

```bash
# Drivers VA-API y VDPAU
sudo dnf swap mesa-va-drivers mesa-va-drivers-freeworld
sudo dnf swap mesa-vdpau-drivers mesa-vdpau-drivers-freeworld
```

```
Falta de otros repositorios
```


---

## 3. Optimizaciones del Sistema

### 3.1 Configuración de Red y Arranque

```bash
# Reducir tiempo de arranque (deshabilitar espera de red)
sudo systemctl disable NetworkManager-wait-online.service

# Deshabilitar Gnome Software del inicio automático (ahorra RAM)
systemctl --user mask org.gnome.Software.service
```

### 3.2 Optimizaciones de CPU (Solo sistemas personales)

```bash
# Deshabilitar mitigaciones de CPU (aumenta rendimiento 5-30%)
# ⚠️ No recomendado para servidores o VMs
sudo grubby --update-kernel=ALL --args="mitigations=off"
```

### 3.3 Suspensión Moderna (Laptops)

```bash
# Mejorar duración de batería en suspensión
sudo grubby --update-kernel=ALL --args="mem_sleep_default=s2idle"

# Verificar configuración
cat /sys/power/mem_sleep
```

---

## 4. Configuración del Sistema

### 4.1 Hostname y Hora

```bash
# Establecer nombre del equipo
sudo hostnamectl set-hostname mi-equipo-fedora

# Configurar hora UTC (para dual boot con Windows)
timedatectl set-local-rtc 1 --adjust-system-clock
timedatectl  # Verificar
```

### 4.2 Teclado US Internacional

```bash
# Configurar teclado como en Windows (altgr-intl) para Wayland y X11
gsettings set org.gnome.desktop.input-sources sources "[('xkb', 'us+altgr-intl')]"
sudo localectl set-x11-keymap us altgr-intl
```

### 4.3 Automontar Discos al Inicio

```bash
# Obtener UUID de la partición
lsblk -f

# Crear punto de montaje
sudo mkdir -p /media/mi_disco

# Editar fstab
sudo micro /etc/fstab
# Añadir: UUID=tu-uuid /media/mi_disco ntfs3 defaults 0 2

# Probar montaje
sudo mount -a
```

---

## 5. Instalación de Aplicaciones Base

### 5.1 Herramientas Esenciales

```bash
sudo dnf install -y \
    git wget curl micro rsync htop btop fastfetch unzip \
    gcc make fuse perl-Image-ExifTool clutter pipx \
    zenity dialog yazi fish helix
```

### 5.2 Visual Studio Code

```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
sudo dnf install -y code
```

### 5.3 Calibre (Gestor de libros electrónicos)

```bash
sudo dnf install -y calibre
```

---

## 6. Navegadores Web

### 6.1 Zen Browser (Recomendado - Firefox-based)

```bash
flatpak install flathub app.zen_browser.zen
```

### 6.2 Brave Browser (Alternativa)

```bash
sudo dnf install dnf-plugins-core

sudo dnf config-manager addrepo --from-repofile=https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo

sudo dnf install brave-origin
```

---

## 7. Desarrollo y Herramientas CLI

### 7.1 Git Configuración

```bash
# Configurar identidad
git config --global user.name "tu_usuario"
git config --global user.email "tu_email@example.com"
git config --global init.defaultBranch main

# Almacenar credenciales
git config --global credential.helper store
```

### 7.2 Rust y Cargo

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Recargar PATH
source ~/.bashrc

# Agregar Cargo al PATH (si no está)
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.cargo/bin:$PATH"
```

### 7.3 Herramientas en Rust

```bash
# Instalar herramientas útiles
cargo install macchina bottom --locked typst-cli
```

### 7.4 Starship (Prompt personalizado)

```bash
# Opción 1: Script oficial
curl -sS https://starship.rs/install.sh | sh

# Opción 2: Desde COPR
# sudo dnf copr enable atim/starship
# sudo dnf install -y starship

# Configurar para Fish
echo 'starship init fish | source' >> ~/.config/fish/config.fish
```

### 7.5 Otras Herramientas CLI

```bash
# YADM (Gestor de dotfiles)
sudo curl -fLo /usr/local/bin/yadm https://github.com/yadm-dev/yadm/raw/master/yadm
sudo chmod a+x /usr/local/bin/yadm

# SPF (Superfile - gestor de archivos TUI)
bash -c "$(wget -qO- https://superfile.netlify.app/install.sh)"

# mnamer (Renombrador de películas)
pipx install mnamer
```

---

## 8. Docker

### 8.1 Instalación

```bash
# Eliminar versiones antiguas
sudo dnf remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine

# Instalar repositorio y Docker
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Iniciar y verificar
sudo systemctl start docker
sudo docker run hello-world
```

### 8.2 Docker sin sudo

```bash
# Crear grupo y agregar usuario
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker run hello-world
```

### 8.3 Docker al inicio del sistema

```bash
# Habilitar auto-inicio
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

---

## 9. Aplicaciones Flatpak

### 9.1 Aplicaciones Recomendadas

```bash
# Gestor de extensiones GNOME
flatpak install flathub com.mattjakeman.ExtensionManager

# Web Apps (convertir sitios en apps)
flatpak install flathub net.codelogistics.webapps

# LocalSend (compartir archivos en red local)
flatpak install flathub org.localsend.localsend_app
```

---

## 10. Personalización

### 10.1 Tema Dracula para Micro Editor

```bash
# Instalar tema
mkdir -p ~/.config/micro/colorschemes
curl -o ~/.config/micro/colorschemes/dracula.micro https://raw.githubusercontent.com/dracula/micro/master/dracula.micro

# Habilitar true color
echo 'export MICRO_TRUECOLOR=1' >> ~/.bashrc
```

### 10.2 Waypaper (Fondo de pantalla dinámico)

```bash
# Desde COPR (recomendado)
sudo dnf copr enable solopasha/hyprland
sudo dnf install -y waypaper

# O con pipx
# pipx install waypaper
```

### 10.3 Niri (Compositor Wayland - Opcional)

```bash
# COPR oficial (mantenido por el desarrollador de niri)
sudo dnf copr enable yalter/niri
sudo dnf install niri

# Nightly (opcional, para últimas features)
# sudo dnf copr enable yalter/niri-git
# sudo dnf install niri
```

Niri no incluye shell de escritorio (barra, lanzador, notificaciones). Se recomienda combinarlo con Noctalia (sección 10.4) o usar componentes sueltos como Waybar + fuzzel + mako.

### 10.4 Noctalia (Desktop Shell para Wayland)

[Noctalia](https://docs.noctalia.dev) es un shell de escritorio nativo Wayland que unifica barra, dock, lanzador, notificaciones, lock screen, wallpaper, centro de control y más en un solo paquete coherente.

```bash
# Habilitar COPR e instalar
sudo dnf copr enable lionheartp/Hyprland
sudo dnf install noctalia-git
```

Configuración adicional para Niri: [docs.noctalia.dev/v5/compositor-settings/niri/](https://docs.noctalia.dev/v5/compositor-settings/niri/)

### 10.5 Noctalia + Niri: activar/desactivar el shell

Para que Noctalia inicie automáticamente con Niri:

```bash
# Activar (desde el próximo login)
systemctl --user add-wants niri.service noctalia

# Desactivar (vuelve a Niri limpio)
systemctl --user disable noctalia
```

También puedes iniciar/detener Noctalia en caliente sin cerrar sesión:

```bash
# Iniciar ahora
systemctl --user start noctalia

# Detener ahora (vuelve a Niri solo)
systemctl --user stop noctalia

# Ver estado
systemctl --user status noctalia
```

**Alternativa:** Si prefieres tener dos sesiones separadas en el gestor de inicio de sesión (GDM/SDDM), puedes copiar el archivo `.desktop` de Niri y crear una variante que lance `niri-session` con Noctalia preconfigurado. Pregúntame si quieres ayuda con eso.

### 10.6 Nerd Fonts

```bash
# Buscar fuentes disponibles
sudo dnf search nerd-fonts

# Instalar ejemplo (Cascadia Code con Nerd Fonts)
sudo dnf install -y nerd-fonts-cascadia-code
```

---

## 11. Mantenimiento

### 11.1 Actualizaciones Automáticas

```bash
# Instalar dnf-automatic
sudo dnf install -y dnf-automatic

# Configurar (editar /etc/dnf/automatic.conf)
sudo micro /etc/dnf/automatic.conf
# Para solo notificar:
# upgrade_type = default
# emit_via = motd
#
# Para aplicar automáticamente:
# upgrade_type = security
# apply_updates = yes

# Habilitar servicio
sudo systemctl enable --now dnf-automatic.timer
systemctl status dnf-automatic.timer
```

### 11.2 Limpieza Periódica

```bash
# Limpiar caché de DNF
sudo dnf clean all

# Eliminar paquetes huérfanos
sudo dnf autoremove
```

---

## 12. Solución de Problemas

### 12.1 Problemas con Codecs

```sh
sudo dnf swap ffmpeg-free ffmpeg --allowerasing
sudo dnf install -y ffmpeg-libs
```

