# Patient Management System

A web-based healthcare application for monitoring patient treatment adherence and managing patient records. The system integrates with FDA drug databases and real-time health news APIs to provide comprehensive patient care information.

## Features

- **Patient Management**: Add, view, search, and filter patient records
- **Treatment Information**: Automatically fetch FDA-approved medication recommendations based on patient conditions
- **Adherence Tracking**: Monitor patient medication adherence levels with visual indicators
- **Health News**: Display latest health news articles relevant to healthcare professionals
- **Smart Filtering**: Filter patients by condition and adherence level
- **Search Functionality**: Quick search by patient name, ID, or condition
- **Data Validation**: Ensures unique patient IDs and proper data formats

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: 
  - OpenFDA Drug Label API
  - NewsData.io API

## API Attribution

This application uses the following external APIs:

### 1. OpenFDA Drug Label API
- **Provider**: U.S. Food and Drug Administration (FDA)
- **Purpose**: Retrieves FDA-approved drug information and treatment recommendations
- **Documentation**: https://open.fda.gov/apis/drug/label/
- **License**: Public domain (U.S. Government work)
- **Rate Limit**: 240 requests per minute, 120,000 requests per day

### 2. NewsData.io API
- **Provider**: NewsData.io
- **Purpose**: Fetches latest health news articles
- **Documentation**: https://newsdata.io/documentation
- **License**: Free tier available (200 requests/day)
- **Attribution Required**: Yes

## Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A web server (for local testing: Python's SimpleHTTPServer, VS Code Live Server, or similar)
- NewsData.io API key (free registration required)

### Local Setup

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd patient-management-system
   ```

2. **Create a config.js file**
   
   Create a file named `config.js` in the project root with your API key:
   ```javascript
   const API_KEYS = {
       NEWSDATA: 'your_newsdata_api_key_here'
   };
   ```

3. **Get your NewsData.io API key**
   - Visit https://newsdata.io/
   - Click "Get Free API Key"
   - Sign up with your email
   - Copy your API key and paste it in `config.js`

4. **Start a local web server**
   
   Option 1 - Using Python:
   ```bash
   # Python 3
   python -m http.server 5500
   
   # Python 2
   python -m SimpleHTTPServer 5500
   ```
   
   Option 2 - Using VS Code:
   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

5. **Open in browser**
   
   Navigate to `http://localhost:5500` (or your server's address)

## Usage

### Adding a Patient
1. Click "Add a new Patient" button
2. Fill in the required information:
   - **Patient Name**: Full name
   - **Patient ID**: Numeric ID only (must be unique)
   - **Condition**: Select from dropdown (Diabetes, Hypertension, Asthma, Cardiovascular)
   - **Adherence Level**: Percentage (0-100)
3. Click "Add Patient"
4. The system will automatically fetch treatment recommendations from the FDA database

### Viewing All Patients
1. Click "All Patients" button
2. View patient cards with:
   - Patient information
   - Adherence status (color-coded)
   - FDA-recommended treatments
   - Attention alerts for low adherence

### Searching Patients
1. Enter search terms in the search bar (name, ID, or condition)
2. Click "SEARCH"
3. Click "CLEAR" to reset

### Filtering Patients
- **Filter by Condition**: Select specific medical condition
- **Filter by Adherence Level**: 
  - High (80-100%)
  - Medium (50-79%)
  - Low (0-49%)

### Health News
- Automatically loads on dashboard
- Displays 5 latest health news articles
- Click "Read More" to view full articles

## Project Structure

```
patient-management-system/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # Main JavaScript logic
├── config.js           # API keys (not tracked in git)
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Security Notes

- **API Keys**: The `config.js` file containing API keys is excluded from version control via `.gitignore`
- **Patient Data**: Currently stored in browser memory (data resets on page refresh)
- **Data Validation**: Patient IDs must be numeric and unique

## Known Limitations

1. **Data Persistence**: Patient data is stored in memory and will be lost on page refresh
2. **API Rate Limits**: 
   - NewsData.io: 200 requests/day (free tier)
   - OpenFDA: 240 requests/minute
3. **Treatment Data Availability**: Some conditions may have limited FDA drug label data
4. **Browser Storage**: No localStorage implementation yet

## Future Enhancements

- Add localStorage for data persistence
- Implement backend database for multi-user support
- Add user authentication
- Export patient data (CSV, PDF)
- Enhanced error notifications with toast messages
- Patient history tracking
- Appointment scheduling integration

## Error Handling

The application includes basic error handling:
- API request failures are logged to console
- Users are notified when treatment data is unavailable
- Form validation prevents duplicate Patient IDs
- Input validation ensures proper data formats

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits

- **FDA Drug Data**: U.S. Food and Drug Administration OpenFDA Initiative
- **News Data**: NewsData.io
- **Developer**: Cindy Saro Teta
- **Course**:   Web Infrastracture
- **Institution**: African Leadership University

## License

This project is created for educational purposes.

## Support

For issues or questions:
- Check the browser console for error messages
- Verify your API key is correctly configured in `config.js`
- Ensure you're not exceeding API rate limits

## Deployment

[Deployment instructions will be added here once the application is deployed to web servers]

---

**Note**: This is an educational project demonstrating API integration and patient data management. It is not intended for actual clinical use.