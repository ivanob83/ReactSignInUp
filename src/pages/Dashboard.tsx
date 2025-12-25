export default function Dashboard() {
    return (
        <div className="form-container">
            <form className="settings-form">
                <h2 className="form-title">Dashboard</h2>
                <p className="form-subtitle">
                    Manage how you receive notifications
                </p>

                <div className="form-switch">
                    <div>
                        <label className="form-check-label">
                            Email notifications
                        </label>
                        <div className="form-text">
                            Receive notifications via email
                        </div>
                    </div>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked
                    />
                </div>

                <div className="form-switch">
                    <div>
                        <label className="form-check-label">
                            Push notifications
                        </label>
                        <div className="form-text">
                            Receive notifications on your device
                        </div>
                    </div>
                    <input className="form-check-input" type="checkbox" />
                </div>

                <div className="form-switch">
                    <div>
                        <label className="form-check-label">
                            Weekly digest
                        </label>
                        <div className="form-text">
                            Get a weekly summary of activity
                        </div>
                    </div>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked
                    />
                </div>

                <div className="form-switch">
                    <div>
                        <label className="form-check-label">
                            Marketing emails
                        </label>
                        <div className="form-text">
                            Receive updates about new features
                        </div>
                    </div>
                    <input className="form-check-input" type="checkbox" />
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-4">
                    Save preferences
                </button>
            </form>
        </div>
    );
}
