const St = imports.gi.St;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Gio = imports.gi.Gio;

const icons = [
    "lenovo-yoga-mode-laptop-color.png",
    "lenovo-yoga-mode-tent-color.png",
    "lenovo-yoga-mode-tablet-color.png",
    "lenovo-yoga-mode-stand-color.png"
]

function _laptop() {
    global.log("laptop");
    _rotateNormal();
    _enablePointers();
}
function _tent() {
    global.log("tent");
    _rotateInverted();
    _disablePointers();
}
function _tablet() {
    global.log("tablet");
    _rotateLeft();
    _disablePointers();
}
function _stand() {
    global.log("stand");
    _rotateNormal();
    _disablePointers();
}

const actions = [_laptop, _tent, _tablet, _stand]

const pointers = [
    "SynPS/2 Synaptics TouchPad",
    "TPPS/2 IBM TrackPoint"
]

function _disablePointers() {
    try {
        pointers.forEach(function(pointer) {
            Main.Util.trySpawnCommandLine("xinput disable '" + pointer + "'");
        });
        Main.Util.trySpawnCommandLine("dconf write /org/gnome/desktop/interface/text-scaling-factor 1.0");
    } catch (e) {
        global.log(e);
    }
}


function _enablePointers() {
    try {
        pointers.forEach(function(pointer) {
            Main.Util.trySpawnCommandLine("xinput enable '" + pointer + "'");
        });
        Main.Util.trySpawnCommandLine("dconf write /org/gnome/desktop/interface/text-scaling-factor 0.707");
    } catch (e) {
        global.log(e);
    }
}

function _rotateNormal() {
    try {
        Main.Util.trySpawnCommandLine("xrandr --output eDP-1 --rotate normal");
    } catch (e) {
        global.log(e);
    }
}

function _rotateLeft() {
    try {
        Main.Util.trySpawnCommandLine("xrandr --output eDP-1 --rotate left");
    } catch (e) {
        global.log(e);
    }
}

function _rotateRight() {
    try {
        Main.Util.trySpawnCommandLine("xrandr --output eDP-1 --rotate right");
    } catch (e) {
        global.log(e);
    }
}

function _rotateInverted() {
    try {
        Main.Util.trySpawnCommandLine("xrandr --output eDP-1 --rotate inverted");
    } catch (e) {
        global.log(e);
    }
}


let buttons;

function _onButtonPress(button) {
    for(let i=0; i < buttons.length; i++) {
        if(buttons[i] === button) {
            actions[i]();
        }
    }
}


function init() {
    buttons = [];

    icons.forEach(function(icon) {
        let button = new St.Bin({ style_class: 'panel-button',
                              reactive: true,
                              can_focus: true,
                              x_fill: true,
                              y_fill: false,
                              track_hover: true });
        let gicon = Gio.icon_new_for_string(Me.path + "/" + icon);
        let child = new St.Icon({ gicon: gicon,
                                  style_class: 'system-status-icon'});

        //child = new St.Icon({ icon_name: icon,
        //                      style_class: 'system-status-icon' });
        button.set_child(child);
        button.connect('button-press-event', _onButtonPress);
        
        buttons.push(button);
    });
}

function enable() {
    for(let i=0; i < buttons.length; i++) {
        Main.panel._rightBox.insert_child_at_index(buttons[i], i);
    }
}

function disable() {
    buttons.forEach(function(button) {
        Main.panel._rightBox.remove_child(button);
    });
}
