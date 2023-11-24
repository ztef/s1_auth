class vi_DataSource {
    constructor(sourceType, configPath) {
        this.sourceType = sourceType;
        this.configPath = configPath;
        this.config = null;

        // Load the configuration in the constructor
        this.loadConfig();
    }

    // Method to load the configuration from the specified path
    async loadConfig() {
        try {
            // Use the Fetch API to load the configuration
            const response = await fetch(this.configPath);

            if (response.ok) {
                // Parse the configuration from the response
                const configData = await response.json();
                this.config = configData;

                console.log('DATA SOURCE READY');
            } else {
                console.error('Failed to fetch the configuration:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error loading the configuration:', error);
        }
    }
}

export default vi_DataSource;
