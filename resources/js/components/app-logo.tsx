import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <img 
                    src="/images/logo.png" 
                    alt="Logo" 
                    className="h-10 w-auto"
                />
            </div>
            <div className="ml-3">
                <span className="text-lg font-semibold text-foreground">SOWRYZEL</span>
            </div>
        </div>
    );
}
