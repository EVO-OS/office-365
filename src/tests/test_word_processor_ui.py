import unittest
from gi.repository import Gtk

class TestWordProcessorUI(unittest.TestCase):
    def setUp(self):
        # Load the UI from the Glade file
        self.builder = Gtk.Builder()
        self.builder.add_from_file('word_processor_ui.glade')
        self.window = self.builder.get_object('main_window')

    def test_window_title(self):
        # Test the window title is set correctly
        self.assertEqual(self.window.get_title(), 'Word Processor')

    def test_button_exists(self):
        # Test that the advanced buttons exist
        new_button = self.builder.get_object('new_button')
        open_button = self.builder.get_object('open_button')
        save_button = self.builder.get_object('save_button')
        self.assertIsNotNone(new_button)
        self.assertIsNotNone(open_button)
        self.assertIsNotNone(save_button)

    def test_button_labels(self):
        # Test that the buttons have the correct labels
        new_button = self.builder.get_object('new_button')
        open_button = self.builder.get_object('open_button')
        save_button = self.builder.get_object('save_button')
        self.assertEqual(new_button.get_label(), 'New')
        self.assertEqual(open_button.get_label(), 'Open')
        self.assertEqual(save_button.get_label(), 'Save')

    def test_button_tooltips(self):
        # Test that the buttons have tooltips
        new_button = self.builder.get_object('new_button')
        open_button = self.builder.get_object('open_button')
        save_button = self.builder.get_object('save_button')
        self.assertEqual(new_button.get_tooltip_text(), 'Create a new document')
        self.assertEqual(open_button.get_tooltip_text(), 'Open an existing document')
        self.assertEqual(save_button.get_tooltip_text(), 'Save the current document')

    # Additional tests would be added here for other UI elements and functionality

if __name__ == '__main__':
    unittest.main()
