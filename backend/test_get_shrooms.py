import unittest
from unittest.mock import MagicMock, patch

from get_shrooms import get_shrooms

class TestGetShrooms(unittest.TestCase):
    @patch('sqlite3.connect')
    def test_get_shrooms_structure(self, mock_connect):
        mock_cursor = MagicMock()
        mock_connect.return_value.cursor.return_value = mock_cursor
        
        mock_description = [('id',), ('name',), ('scientificName',)]
        mock_cursor.description = mock_description
        
        mock_cursor.fetchall.return_value = [
            (1, 'Example Mushroom', 'Example Scientific Name'),
        ]
        result = get_shrooms()

        self.assertIsInstance(result, dict)
        self.assertIn('data', result)

        self.assertIsInstance(result['data'], list)

        if result['data']:
            for item in result['data']:
                self.assertIsInstance(item, dict)
                self.assertSetEqual(set(item.keys()), {'id', 'name', 'scientificName'})

        mock_connect.return_value.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()