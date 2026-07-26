import unittest

import numpy as np

import verify


class MetricTests(unittest.TestCase):
    def test_rank_auc_matches_a_known_example(self):
        labels = np.array([0, 0, 1, 1])
        scores = np.array([0.1, 0.4, 0.35, 0.8])
        self.assertEqual(verify.rank_auc(labels, scores), 0.75)

    def test_rank_auc_averages_tied_ranks(self):
        labels = np.array([0, 1])
        scores = np.array([0.5, 0.5])
        self.assertEqual(verify.rank_auc(labels, scores), 0.5)

    def test_changed_row_identifier_is_rejected(self):
        labels = np.array([0, 1])
        predictions = np.array(
            [
                [0, 0.8, 0.2],
                [0, 0.1, 0.9],
            ]
        )
        with self.assertRaisesRegex(ValueError, "identifiers"):
            verify.validate_predictions(predictions, labels, "changed.csv")

    def test_changed_source_bytes_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "SHA256 changed"):
            verify.require_checksum(b"changed", "sha256", "0" * 64, "fixture")


if __name__ == "__main__":
    unittest.main()
