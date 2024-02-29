import unittest
from unittest.mock import MagicMock, patch
import get_finds

class TestGetFinds(unittest.TestCase):
    @patch('get_finds.sqlite3')  # Mocks the sqlite3 module
    def test_get_finds(self, mock_sqlite):
        # Mock database response with the specified modifications
        mock_cur = MagicMock()
        mock_cur.fetchall.return_value = [
            (1, 'Champignon', 38.897957, -77.036560, 'Wiese'),
            (2, 'Champignon', 35.689487, 139.691706, 'Wiese')
        ]
        mock_cur.description = [('id',), ('mushroom',), ('latitude',), ('longitude',), ('environment',)]
        mock_con = MagicMock()
        mock_con.cursor.return_value = mock_cur
        mock_sqlite.connect.return_value = mock_con

        expected = {
            "data": [
                {"id": 1, "mushroom": "Champignon", "latitude": 38.897957, "longitude": -77.036560, "environment": "Wiese"},
                {"id": 2, "mushroom": "Champignon", "latitude": 35.689487, "longitude": 139.691706, "environment": "Wiese"}
            ]
        }
        result = get_finds.get_finds()
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()
