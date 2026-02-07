import PasswordController from './PasswordController'
import ProfileController from './ProfileController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'

const Settings = {
    PasswordController: Object.assign(PasswordController, PasswordController),
    ProfileController: Object.assign(ProfileController, ProfileController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings