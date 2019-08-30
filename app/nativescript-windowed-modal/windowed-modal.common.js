"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color");
var platform_1 = require("tns-core-modules/platform");
var ViewClass = require("tns-core-modules/ui/core/view");
var utils = require("tns-core-modules/utils/utils");
var viewCommon = require("ui/core/view/view-common").ViewCommon;
var modalMap = new Map();
var DialogFragmentStatic;
function overrideModalViewMethod() {
    ViewClass.View.prototype._showNativeModalView = platform_1.isIOS ? iosModal : androidModal;
}
exports.overrideModalViewMethod = overrideModalViewMethod;
function iosModal(parent, context, closeCallback, fullscreen, animated, stretched) {
    var _this = this;
    var parentWithController = ViewClass.ios.getParentWithViewController(parent);
    if (!parentWithController) {
        throw new Error("Could not find parent with viewController for " + parent + " while showing modal view.");
    }
    var parentController = parentWithController.viewController;
    if (!parentController.view.window) {
        throw new Error("Parent page is not part of the window hierarchy. Close the current modal page before showing another one!");
    }
    this._setupAsRootView({});
    viewCommon.prototype._showNativeModalView.call(this, parentWithController, context, closeCallback, fullscreen, stretched);
    var controller = this.viewController;
    if (!controller) {
        var nativeView = this.ios || this.nativeViewProtected;
        controller = ViewClass.ios.UILayoutViewController.initWithOwner(new WeakRef(this));
        if (nativeView instanceof UIView) {
            controller.view.addSubview(nativeView);
        }
        this.viewController = controller;
    }
    if (fullscreen) {
        controller.modalPresentationStyle = 2;
    }
    else {
        controller.providesPresentationContextTransitionStyle = true;
        controller.definesPresentationContext = true;
        controller.modalPresentationStyle = 6;
        controller.modalTransitionStyle = 0;
        controller.view.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 0.5);
    }
    this.horizontalAlignment = "center";
    this.verticalAlignment = "middle";
    this._raiseShowingModallyEvent();
    animated = animated === undefined ? true : !!animated;
    controller.animated = animated;
    parentController.presentViewControllerAnimatedCompletion(controller, animated, null);
    var transitionCoordinator = utils.ios.getter(parentController, parentController.transitionCoordinator);
    if (transitionCoordinator) {
        UIViewControllerTransitionCoordinator.prototype.animateAlongsideTransitionCompletion.call(transitionCoordinator, null, function () { return _this._raiseShownModallyEvent(); });
    }
    else {
        this._raiseShownModallyEvent();
    }
}
function androidModal(parent, context, closeCallback, fullscreen, animated, stretched) {
    var _this = this;
    var DOM_ID = "_domId";
    viewCommon.prototype._showNativeModalView.call(this, parent, context, closeCallback, fullscreen, stretched);
    if (!this.backgroundColor) {
        this.backgroundColor = new color_1.Color("transparent");
    }
    this._setupUI(parent._context);
    this._isAddedToNativeVisualTree = true;
    var initializeDialogFragment = function () {
        if (DialogFragmentStatic) {
            return DialogFragmentStatic;
        }
        var CustomDialogImpl = (function (_super) {
            __extends(CustomDialogImpl, _super);
            function CustomDialogImpl(fragment, context, themeResId) {
                var _this = _super.call(this, context, themeResId) || this;
                _this.fragment = fragment;
                return global.__native(_this);
            }
            CustomDialogImpl.prototype.onBackPressed = function () {
                var view = this.fragment.owner;
                var args = {
                    eventName: "activityBackPressed",
                    object: view,
                    activity: view._context,
                    cancel: false
                };
                view.notify(args);
                if (!args.cancel && !view.onBackPressed()) {
                    _super.prototype.onBackPressed.call(this);
                }
            };
            return CustomDialogImpl;
        }(android.app.Dialog));
        var CustomDialogFragmentImpl = (function (_super) {
            __extends(CustomDialogFragmentImpl, _super);
            function CustomDialogFragmentImpl() {
                var _this = this;
                try {
                    _this = _super.call(this) || this;
                }
                catch (e) {
                    console.log(e);
                }
                return global.__native(_this);
            }
            CustomDialogFragmentImpl.prototype.onCreateDialog = function (savedInstanceState) {
                var ownerId = this.getArguments().getInt(DOM_ID);
                var options = modalMap.get(ownerId);
                this.owner = options.owner;
                this._fullscreen = options.fullscreen;
                this._stretched = options.stretched;
                this._dismissCallback = options.dismissCallback;
                this._shownCallback = options.shownCallback;
                this.owner._dialogFragment = this;
                this.setStyle(android.support.v4.app.DialogFragment.STYLE_NO_TITLE, 0);
                var dialog = new CustomDialogImpl(this, this.getActivity(), this.getTheme());
                if (!this._fullscreen && !this._stretched) {
                    this.owner.horizontalAlignment = "center";
                    this.owner.verticalAlignment = "middle";
                }
                else {
                    this.owner.horizontalAlignment = "stretch";
                    this.owner.verticalAlignment = "stretch";
                }
                var window = dialog.getWindow();
                window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                return dialog;
            };
            CustomDialogFragmentImpl.prototype.onCreateView = function (inflater, container, savedInstanceState) {
                var owner = this.owner;
                owner._setupAsRootView(this.getActivity());
                owner._isAddedToNativeVisualTree = true;
                return owner.nativeViewProtected;
            };
            CustomDialogFragmentImpl.prototype.onStart = function () {
                _super.prototype.onStart.call(this);
                if (this._fullscreen) {
                    var window_1 = this.getDialog().getWindow();
                    var length_1 = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
                    window_1.setLayout(length_1, length_1);
                    window_1.setBackgroundDrawable(null);
                }
                var owner = this.owner;
                if (!owner.isLoaded) {
                    owner.callLoaded();
                }
                this._shownCallback();
            };
            CustomDialogFragmentImpl.prototype.onDismiss = function (dialog) {
                _super.prototype.onDismiss.call(this, dialog);
                var manager = this.getFragmentManager();
                if (manager) {
                    modalMap.delete(this.owner._domId);
                    this._dismissCallback();
                }
                var owner = this.owner;
                if (owner.isLoaded) {
                    owner.callUnloaded();
                }
            };
            CustomDialogFragmentImpl.prototype.onDestroy = function () {
                _super.prototype.onDestroy.call(this);
                var owner = this.owner;
                owner._isAddedToNativeVisualTree = false;
                owner._tearDownUI(true);
            };
            return CustomDialogFragmentImpl;
        }(android.support.v4.app.DialogFragment));
        DialogFragmentStatic = CustomDialogFragmentImpl;
    };
    initializeDialogFragment();
    var args = new android.os.Bundle();
    args.putInt(DOM_ID, this._domId);
    this._dialogFragment = new DialogFragmentStatic();
    this._dialogFragment.setArguments(args);
    var dialogOptions = {
        owner: this,
        fullscreen: !!fullscreen,
        stretched: !!stretched,
        shownCallback: function () { return _this._raiseShownModallyEvent(); },
        dismissCallback: function () { return _this.closeModal(); }
    };
    modalMap.set(dialogOptions.owner._domId, dialogOptions);
    viewCommon.prototype._raiseShowingModallyEvent.call(this);
    this._dialogFragment.show(parent._getRootFragmentManager(), this._domId.toString());
}
//# sourceMappingURL=windowed-modal.common.js.map