import ConfirmablePasswordController from './ConfirmablePasswordController'
import ConfirmedPasswordStatusController from './ConfirmedPasswordStatusController'
import TwoFactorQrCodeController from './TwoFactorQrCodeController'
import TwoFactorSecretKeyController from './TwoFactorSecretKeyController'
import RecoveryCodeController from './RecoveryCodeController'
import ConfirmedTwoFactorAuthenticationController from './ConfirmedTwoFactorAuthenticationController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'

const Controllers = {
    ConfirmablePasswordController: Object.assign(ConfirmablePasswordController, ConfirmablePasswordController),
    ConfirmedPasswordStatusController: Object.assign(ConfirmedPasswordStatusController, ConfirmedPasswordStatusController),
    TwoFactorQrCodeController: Object.assign(TwoFactorQrCodeController, TwoFactorQrCodeController),
    TwoFactorSecretKeyController: Object.assign(TwoFactorSecretKeyController, TwoFactorSecretKeyController),
    RecoveryCodeController: Object.assign(RecoveryCodeController, RecoveryCodeController),
    ConfirmedTwoFactorAuthenticationController: Object.assign(ConfirmedTwoFactorAuthenticationController, ConfirmedTwoFactorAuthenticationController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Controllers