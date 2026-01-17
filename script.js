/* script.js - Logique unique pour la génération PDF et la navigation */

document.addEventListener('DOMContentLoaded', function() {

    // --- GESTIONNAIRE POUR LE BOUTON DE GÉNÉRATION PDF ---
    const generateBtn = document.getElementById('bobBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function () {
            // 1. Récupération des cases à cocher
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const checked = [];
            const unchecked = [];

            checkboxes.forEach(cb => {
                // On cherche le span à l'intérieur du label parent
                const label = cb.parentElement;
                const span = label.querySelector('span');
                if (span) {
                    const text = span.textContent.trim();
                    if (cb.checked) {
                        checked.push(text);
                    } else {
                        unchecked.push(text);
                    }
                }
            });

            // 2. Vérification de la librairie jsPDF
            if (!window.jspdf) {
                alert("Erreur : La librairie jsPDF n'est pas chargée. Vérifiez votre connexion internet ou le lien du script.");
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // 3. Récupération du titre de la page (ex: FPTL, VTUL...)
            const titreElement = document.getElementById("engin");
            const titre = titreElement ? titreElement.textContent : "Inventaire";

            // 4. Configuration de la mise en page
            let ligne_n = 50;
            const marge_haut = 20;
            const marge_gauche = 10;
            const hauteur_ligne = 10;
            const hauteur_page = doc.internal.pageSize.getHeight();
            const marge_bas = 20;

            // Fonction utilitaire pour gérer le saut de page
            function checkPageSpace() {
                if (ligne_n + hauteur_ligne > hauteur_page - marge_bas) {
                    doc.addPage();
                    ligne_n = marge_haut;
                }
            }

            // 5. Écriture du contenu
            // Titre
            doc.setFontSize(22);
            doc.text("Compte rendu matériel " + titre, marge_gauche, marge_haut);
            
            // Récupération et ajout du nom et matricule
            const nomInput = document.getElementById("nom");
            const matriculeInput = document.getElementById("matricule");
            const nom = nomInput ? nomInput.value : "Non renseigné";
            const matricule = matriculeInput ? matriculeInput.value : "Non renseigné";

            ligne_n = marge_haut + 30; // Ajuster la position après le titre
            doc.setFontSize(12);
            doc.text("Nom de la personne qui rédige le compte rendu : " + nom, marge_gauche, ligne_n);
            ligne_n += hauteur_ligne;
            doc.text("Matricule : " + matricule, marge_gauche, ligne_n);
            
            // Date
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Keep month for filename
            const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            const monthName = monthNames[today.getMonth()];
            const year = today.getFullYear();

            ligne_n += hauteur_ligne; 
            doc.setFontSize(12);
            doc.text(`Fait le ${day} ${monthName} ${year}`, marge_gauche, ligne_n);

            ligne_n += hauteur_ligne * 2; // Ajouter un espace avant la liste

            // Liste présent
            doc.setFontSize(16);
            doc.setTextColor(0, 100, 0); // Vert foncé pour le positif (optionnel)
            doc.text("Liste du matériel présent :", marge_gauche, ligne_n);
            doc.setTextColor(0, 0, 0); // Retour au noir
            ligne_n += hauteur_ligne;

            if (checked.length === 0) {
                doc.setFontSize(12);
                doc.text("    (Aucun matériel coché)", marge_gauche, ligne_n);
                ligne_n += hauteur_ligne;
                doc.setFontSize(16);
            } else {
                for (let i = 0; i < checked.length; i++) {
                    checkPageSpace();
                    doc.text("    - " + checked[i], marge_gauche, ligne_n);
                    ligne_n += hauteur_ligne;
                }
            }

            ligne_n += hauteur_ligne;
            checkPageSpace();

            // Liste absent
            doc.setTextColor(200, 0, 0); // Rouge pour le négatif (optionnel)
            doc.text("Liste du matériel absent ou incomplet :", marge_gauche, ligne_n);
            doc.setTextColor(0, 0, 0); // Retour au noir
            ligne_n += hauteur_ligne;

            if (unchecked.length === 0) {
                doc.setFontSize(12);
                doc.text("    (Tout le matériel est présent)", marge_gauche, ligne_n);
                ligne_n += hauteur_ligne;
                doc.setFontSize(16);
            } else {
                for (let i = 0; i < unchecked.length; i++) {
                    checkPageSpace();
                    doc.text("    - " + unchecked[i], marge_gauche, ligne_n);
                    ligne_n += hauteur_ligne;
                }
            }

            // 6. Sauvegarde du fichier
            // Nom de fichier nettoyé (sans espaces bizarres)
            const filename = `Compte_rendu_${titre.replace(/\s+/g, '_')}_${day}-${month}-${year}.pdf`;
            doc.save(filename);
        });
    }

    // --- GESTIONNAIRE POUR LE BOUTON RETOUR ---
    const backBtn = document.getElementById('gotoIndixBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            // On essaie de remonter d'un niveau. 
            // Si vos fichiers sont plus profonds, il faudra peut-être adapter, 
            // mais "../index.html" est le standard pour remonter au parent.
            window.location.href = "../index.html";
        });
    }
});